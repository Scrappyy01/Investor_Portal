import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      companyName,
      acn,
      street,
      state,
      postcode,
      repName,
      email,
      deedDate,
      signatureBase64
    } = body;

    // Validate required fields
    const requiredFields = { companyName, acn, street, state, postcode, repName, email, deedDate, signatureBase64 };
    const missing = Object.entries(requiredFields).filter(([key, value]) => {
      if (typeof value !== "string") return true;
      if (key === "signatureBase64") return !value.startsWith("data:image");
      return value.trim() === "";
    });

    if (missing.length > 0) {
      return NextResponse.json(
        { message: "Missing or invalid fields", fields: missing.map(([key]) => key) },
        { status: 400 }
      );
    }

    // Load signature images and convert to base64
    const publicDir = join(process.cwd(), "public");
    const sig1Buffer = readFileSync(join(publicDir, "signature.png"));
    const sig2Buffer = readFileSync(join(publicDir, "signature2.png"));
    const logoBuffer = readFileSync(join(publicDir, "kosseris_synergy_logo_gold.png"));
    const footerLogoBuffer = readFileSync(join(publicDir, "logo_no_bg.png"));
    const sig1Base64 = `data:image/png;base64,${sig1Buffer.toString("base64")}`;
    const sig2Base64 = `data:image/png;base64,${sig2Buffer.toString("base64")}`;
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    const footerLogoBase64 = `data:image/png;base64,${footerLogoBuffer.toString("base64")}`;

    // Generate complete HTML with embedded styles and signature
    const html = generatePdfHtml({
      companyName,
      acn,
      street,
      state,
      postcode,
      repName,
      email,
      deedDate,
      signatureBase64,
      sig1Base64,
      sig2Base64,
      logoBase64,
      footerLogoBase64
    });

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "40px",
        bottom: "60px",
        left: "40px",
        right: "40px",
      },
    });

    await browser.close();

    // Send emails to both addresses
    await sendConfidentialityDeedEmails({
      pdfBuffer,
      companyName,
      repName,
      email,
      deedDate,
    });

    // Return PDF as downloadable file
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="confidentiality-deed-${companyName.replace(/[^a-z0-9]/gi, '_')}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF", error: error.message },
      { status: 500 }
    );
  }
}

// Generate complete HTML document with all styles
function generatePdfHtml(data: {
  companyName: string;
  acn: string;
  street: string;
  state: string;
  postcode: string;
  repName: string;
  email: string;
  deedDate: string;
  signatureBase64: string;
  sig1Base64: string;
  sig2Base64: string;
  logoBase64: string;
  footerLogoBase64: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Merriweather', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.8;
      color: #1f2937;
      padding: 0 40px 200px 40px;
      max-width: 100%;
    }
    
    h1 {
      font-size: 20pt;
      font-weight: 700;
      text-align: center;
      margin-bottom: 24px;
      color: #bb964c;
      letter-spacing: 0.5pt;
    }
    
    h2 {
      font-size: 15pt;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 12px;
      color: #bb964c;
    }
    
    h3 {
      font-size: 13pt;
      font-weight: 700;
      margin-top: 16px;
      margin-bottom: 10px;
      color: #bb964c;
    }
    
    p {
      margin-bottom: 12px;
      text-align: justify;
    }
    
    ul {
      margin-left: 40px;
      margin-bottom: 12px;
      list-style-type: lower-alpha;
    }
    
    li {
      margin-bottom: 10px;
      text-align: justify;
    }
    
    strong {
      font-weight: 700;
    }
    
    .signature-section {
      margin-top: 40px;
      page-break-inside: avoid;
    }
    
    .signature-section h3 {
      page-break-after: avoid;
    }
    
    .signature-info {
      margin-top: 30px;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    
    .signature-box {
      border: 2px solid #d1d5db;
      padding: 10px;
      margin: 15px 0 20px 0;
      text-align: center;
      page-break-inside: avoid;
      width: 150px;
      float: left;
      font-size: 9pt;
    }
    
    .signature-image {
      max-width: 130px;
      max-height: 130px;
      margin: 5px auto;
    }
    
    .signature-wrapper {
      page-break-inside: avoid;
      margin-bottom: 20px;
    }
    
    .footer {
      margin-top: 40px;
      font-size: 9pt;
      font-style: italic;
      color: #6b7280;
      text-align: center;
      page-break-inside: avoid;
    }
    
    .watermark {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 450px;
      opacity: 0.25;
      filter: grayscale(100%);
      z-index: -1;
    }
    
    .page-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 0 40px 200px 40px;
    }
    
    .footer-line {
      width: 100%;
      height: 3px;
      background: linear-gradient(to right, #bb964c, #d4af37);
      margin-top: auto;
    }
  </style>
</head>
<body>
  <img src="${data.logoBase64}" alt="Kosseris Synergy Logo" class="watermark" />
  
  <div class="page-footer">
    <div class="footer-line"></div>
  </div>
  
  <h1>CONFIDENTIALITY DEED</h1>
  
  <p>THIS DEED is made the day of <strong>${data.deedDate}</strong></p>

  <p><strong>BETWEEN:</strong> LOAD LINK AUSTRALIA PTY LIMITED (ACN 661 824 175) of Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216 ("Disclosing Party"); and <strong>${data.companyName}</strong> (ACN ${data.acn}) of ${data.street}, ${data.state} ${data.postcode} ("Recipient").</p>

  <h2>WHEREAS:</h2>
  <p>A. The Disclosing Party and the Recipient wish to pursue discussions concerning possible transactions between them and to that end it is necessary for the Disclosing Party to provide certain Confidential Information to the Recipient.</p>
  <p>B. The Confidential Information is of significant commercial value to the Disclosing Party.</p>
  <p>C. The Disclosing Party proposes to make the Confidential Information available to the Recipient for the Permitted Purpose subject to and in consideration of the Recipient entering into this Deed.</p>

  <h2>NOW THIS DEED WITNESSES as follows:</h2>

  <h3>1. DEFINITIONS AND INTERPRETATIONS</h3>
  <p><strong>1.1 Definitions</strong></p>
  <p>"Beneficiaries" means the Disclosing Party and each of its Related Bodies Corporate who have an interest in, or who are the subject of, any of the Confidential Information.</p>
  <p>"Confidential Information" means:</p>
  <ul>
    <li>All commercial, financial, legal and technical information and know-how directly or indirectly related to the business or affairs of the Disclosing Party or its Related Bodies Corporate which is disclosed (whether orally, electronically, in writing or any other form or media whatsoever) by or on behalf of the Disclosing Party to the Recipient or any of its Representatives and includes, without limitation, all documents at any time contained in any Data Room;</li>
    <li>The contents of any discussions or agreements between the parties and/or their Related Bodies Corporate relating to a Permitted Transaction;</li>
    <li>Derived Information;</li>
    <li>The terms and conditions and existence of this Deed;</li>
    <li>The fact that discussions have already occurred between the parties in relation to a possible Permitted Transaction and that further such discussions may occur in the future;</li>
    <li>The fact that the Disclosing Party has disclosed or may disclose information to the Recipient pursuant to this Deed;</li>
  </ul>
  <p>But does not include information:</p>
  <ul>
    <li>Which at the time of first disclosure to the Recipient is in the public domain;</li>
    <li>Which after disclosure to the Recipient comes into the public domain otherwise than by disclosure in breach of the terms of this Deed;</li>
    <li>Which was known to or by the Recipient at the time of first disclosure to it and was not acquired directly or indirectly from the Disclosing Party;</li>
    <li>Which the Recipient receives from a third party, provided that as far as the Recipient is aware (without the need for enquiry) the information was not obtained directly or indirectly from the Disclosing Party in breach of an obligation of confidence owed by the third party to the Disclosing Party or any other person.</li>
  </ul>
  
  <p>"Derived Information" means any note, calculation, conclusion, summary or other material derived or produced partly or wholly from any Confidential Information.</p>
  <p>"document" has the meaning given to it in Section 9 of the Corporations Law.</p>
  <p>"Related Bodies Corporate" has the meaning given to it in Section 50 of the Corporations Law.</p>
  <p>"Representatives" means any directors, officers, employees, legal, financial and other expert advisers and agents of the Recipient.</p>
  <p>"Permitted Purpose" means the purpose of assessing whether or not the Recipient will pursue a Permitted Transaction.</p>
  <p>"Permitted Transaction" means any transaction agreed between the Disclosing Party and the Recipient and/or their respective Bodies Corporate pursuant to which the Recipient or any of its Related Bodies Corporate lends monies to or participates in any commercial transaction with the Disclosing Party or any of its Related Bodies Corporate.</p>

  <p><strong>1.2 Interpretation</strong></p>
  <ul>
    <li>Headings are for convenience only and do not affect interpretation;</li>
    <li>The singular includes the plural and vice versa;</li>
    <li>If a word or phrase is defined, its other grammatical forms have a corresponding meaning;</li>
    <li>A reference to a party to this Deed includes the party's successors and assigns;</li>
    <li>A reference to legislation or to a provision of legislation includes a modification or re-enactment of it, a legislative provision substituted for it and a regulation or statutory instrument issued under it.</li>
  </ul>

  <p><strong>1.3 Consents and approvals</strong></p>
  <p>Except as expressly provided in this Deed, if the doing of any act, matter or thing under this Deed is dependent on the consent or approval of a party or is within the discretion of a party, such consent or approval may be given or such discretion may be exercised conditionally or unconditionally or withheld by the party in its absolute discretion.</p>

  <h3>2. PROVISION OF CONFIDENTIAL INFORMATION</h3>
  <p>Subject to this Deed, the Disclosing Party may, but shall not be obliged to, provide any Confidential Information to the Recipient.</p>

  <h3>3. CONFIDENTIALITY</h3>
  <p><strong>3.1 The Recipient undertakes and covenants (on its own behalf and on behalf of all its Representatives):</strong></p>
  <ul>
    <li>To keep and hold all Confidential Information strictly confidential and, subject to Clause 4, not to disclose or permit the disclosure, publication or communication of any of the Confidential Information to any person except in accordance with the terms of this Deed or unless it obtains the Disclosing Party's prior written consent;</li>
    <li>To take all reasonable steps and do all things that are necessary, prudent or desirable to maintain and preserve the confidentiality of the Confidential Information;</li>
    <li>Not to reproduce or record in any form or use any of the Confidential Information except for the Permitted Purpose;</li>
    <li>Not to permit or cause any of the Confidential Information to be entered into any computer or database which is not solely operated and controlled by the Recipient, without the prior written consent of the Disclosing Party;</li>
    <li>Not to use or appropriate any of the Confidential Information for its own benefit or gain or for any purpose except for the Permitted Purpose, and not to make any use of the Confidential Information or any part of it to the competitive disadvantage of the Disclosing Party or any of its Related Bodies Corporate;</li>
    <li>To ensure that its Representatives are aware that they are obliged to treat any Confidential Information received by them in the same manner as if they were a party to this Deed;</li>
    <li>To ensure that its Representatives and Related Bodies Corporate comply with the Recipient's obligations under this Deed as if each Representative and Related Body Corporate were a party to this Deed;</li>
    <li>To notify the Disclosing Party immediately it suspects or becomes aware of any breach of this Deed;</li>
    <li>To promptly take all reasonable steps, at its own expense, to prevent or stop any actual or suspected breach of this Deed.</li>
  </ul>

  <p><strong>3.2 Prohibition on discussions</strong></p>
  <ul>
    <li>Not, without the prior consent of the Disclosing Party, directly or indirectly make any enquiries of or discuss with any financier, customer, supplier, landlord, tenant or creditor of the Disclosing Party or any of its Related Bodies Corporate, any matters concerning the Confidential Information;</li>
    <li>Not make any enquiries of or discuss with any officer, employee or agent of the Disclosing Party or any of its Related Bodies Corporate, any matters concerning the Confidential Information;</li>
    <li>Not disclose, publish or permit the disclosure or publication of the Permitted Purpose or the fact that any discussions are taking place or have taken place in relation to the Permitted Purpose to any person (other than in accordance with this Deed).</li>
  </ul>

  <h3>4. PERMITTED DISCLOSURE</h3>
  <p>The Recipient may disclose Confidential Information to such of its Representatives or Related Bodies Corporate who reasonably require access to the Confidential Information in order for the Recipient to undertake the Permitted Purpose.</p>

  <h3>5. MANDATORY DISCLOSURE</h3>
  <p>Nothing in this Deed prohibits the Recipient from disclosing any Confidential Information which is required to be disclosed by law, an order of a court, tribunal, government or regulatory body or competent jurisdiction or the Listing Rules of the Australian Stock Exchange Limited, provided that where disclosure is so required, the Recipient must notify the Disclosing Party as soon as reasonably practicable and must provide all reasonable assistance and co-operation to enable the Disclosing Party to seek a protective order or other relief from or to minimise the disclosure.</p>

  <h3>6. DISCLAIMER</h3>
  <p><strong>6.1 Disclosing Party not liable</strong></p>
  <p>The Recipient acknowledges that it is making an independent assessment of the Confidential Information and will verify all information on which it intends to rely to its own satisfaction and that, subject to the Confidential Information being provided in good faith, the Disclosing Party does not and will not give any warranty as to the truth, accuracy, relevance or usefulness of any of the Confidential Information and does not accept any responsibility for any falsity, inaccuracy or misleading information in, or for any omission from, the Confidential Information, except to the extent expressly provided for in any agreement binding upon the Disclosing Party.</p>

  <p><strong>6.2 Recipient's conclusions its own</strong></p>
  <p>The Disclosing Party accepts no responsibility for any interpretation, opinion or conclusion that the Recipient may form as a result of examining the Confidential Information.</p>

  <p><strong>6.3 Opinions expressed may change</strong></p>
  <p>The Recipient acknowledges that any opinions expressed in the Confidential Information are based on the knowledge and approach of the persons forming the opinion at the date that the opinion was formed and may have ceased or may in the future cease to be appropriate in the light of subsequent knowledge or attitudes.</p>

  <p><strong>6.4 The Disclosing Party's rights</strong></p>
  <p>The Disclosing Party reserves all rights in the Confidential Information and no rights or obligations other than those expressly contained in this Deed are granted or to be implied from this Deed. In particular, no licence is granted directly or indirectly under any patent, invention, discovery, copyright or other intellectual property right now or in the future held, made, obtained or licensable by the Disclosing Party. The Recipient acknowledges that the Confidential Information and all intellectual property rights in the Confidential Information (including copyright, design and patent rights) will, to the extent owned prior to disclosure, remain the exclusive property of the Disclosing Party.</p>

  <h3>7. RETURN OF CONFIDENTIAL INFORMATION</h3>
  <p><strong>7.1</strong> Upon the earlier of completion or discontinuance of the Permitted Purpose or request by the Disclosing Party, the Recipient must promptly return to the Disclosing Party (or destroy if the Disclosing Party so directs) all documents and other materials (whether originals, copies or in electronic form) within the custody, power or control of the Recipient which contain any Confidential Information.</p>
  <p>Notwithstanding the foregoing, the Recipient may, in its discretion:</p>
  <ul>
    <li>Deliver or destroy Derived Information;</li>
    <li>Retain minutes of meeting of its directors, together with such supporting documentation as is customarily retained by the Recipient in relation to such minutes, relating to any determination by the directors to pursue a Permitted Transaction.</li>
  </ul>
  <p><strong>7.2</strong> Return, destruction or retention of Confidential Information in accordance with this Clause 7 does not release the Recipient from its obligations under this Deed.</p>

  <h3>8. THIRD PARTIES</h3>
  <p>The Recipient acknowledges that the Disclosing Party is free to disclose any Confidential Information to any other person and is not obliged to notify the Recipient if it does so.</p>

  <h3>9. CONTINUING OBLIGATION</h3>
  <p>The Recipient acknowledges and agrees that the terms, conditions and obligations under this Deed do not cease on the termination or cessation of this Deed or on the completion, postponement or discontinuance of the Permitted Purpose, but will continue indefinitely.</p>

  <h3>10. BENEFIT OF AGREEMENT</h3>
  <p>The Disclosing Party enters into this Deed for and on behalf of itself and the other Beneficiaries. The Recipient acknowledges that the Disclosing Party may enforce this Deed on behalf of itself and the other Beneficiaries.</p>

  <h3>11. INDEMNITY</h3>
  <p><strong>11.1</strong> The Recipient indemnifies and must keep indemnified each of the Beneficiaries from and against all claims, costs, expenses, losses and liabilities (including legal costs on a solicitor and own client basis) suffered or incurred by any of them (including, without limitation, in connection with the enforcement of this Deed) as a result of or in connection with:</p>
  <ul>
    <li>Any breach of this Deed by the Recipient;</li>
    <li>Any act or omission by any of its Representatives which, if done or omitted to be done by the Recipient would constitute a breach of the Recipient's obligations under this Deed.</li>
  </ul>
  <p><strong>11.2</strong> The indemnity given by the Recipient in this Clause 11:</p>
  <ul>
    <li>Is for the benefit of each of the Beneficiaries. The indemnity may be enforced by the Disclosing Party on behalf of itself and the other Beneficiaries or by any Beneficiary on its own behalf;</li>
    <li>Shall survive the termination of this Deed.</li>
  </ul>

  <h3>12. REMEDIES</h3>
  <p>The Recipient acknowledges that damages is an inadequate remedy for any breach of this Deed and that subject to the court's discretion (and in addition to any other remedies available at law or in equity), the Disclosing Party is entitled to specific performance or injunctive relief (as appropriate) in respect of any conduct or proposed conduct by the Recipient or any Representative which is or will constitute a breach of this Deed.</p>

  <h3>13. NOTICES</h3>
  <p>Any notice given under this Deed:</p>
  <ul>
    <li>Must be in writing addressed to the intended recipient at the address shown below or the address last notified by the intended recipient to the sender:</li>
  </ul>
  
  <p><strong>Disclosing Party</strong><br>
  Load Link Australia Pty Limited & Fortis Fundamenta Pty Ltd atf the Fortis Fundamenta Trust<br>
  Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216<br>
  Attention: Mr Anthony Kosseris<br>
  Email: anthony@loadlink.com.au</p>

  <p><strong>Recipient</strong><br>
  ${data.companyName}<br>
  ${data.street}, ${data.state} ${data.postcode}<br>
  Attention: ${data.repName}<br>
  Email: ${data.email}</p>

  <ul>
    <li>Must be signed by a person duly authorised by the sender;</li>
    <li>Will be taken to have been given when delivered, received or left at the above address. If delivery or receipt occurs on a day when business is not generally carried on in the place to which the notice is sent, or is later than 4.00 pm (local time), it will be taken to have been duly given at the commencement of business on the next day when business is generally carried on in that place.</li>
  </ul>

  <h3>14. AMENDMENT</h3>
  <p>This Deed may be amended only by another deed executed by all parties.</p>

  <h3>15. NO WAIVER</h3>
  <p>No failure to exercise and no delay in exercising any right, power or remedy under this Deed will operate as a waiver. Nor will any single or partial exercise of any right, power or remedy preclude any other or further exercise of that or any other right, power or remedy.</p>

  <h3>16. STAMP DUTY AND COSTS</h3>
  <p>Each party shall bear its own costs arising out of the preparation of this Deed. All stamp duty chargeable on this Deed shall be borne by the Recipient. The Recipient shall indemnify the Disclosing Party on demand against any liability for that stamp duty.</p>

  <h3>17. GOVERNING LAW</h3>
  <p>This Deed is governed by the laws in force in Queensland. Each party irrevocably and unconditionally submits to the non-exclusive jurisdiction of the courts exercising jurisdiction there.</p>

  <h3>18. COUNTERPARTS</h3>
  <p>This Deed may be executed in any number of counterparts. All counterparts taken together will be taken to constitute one instrument.</p>

  <div class="signature-section" style="page-break-before: always;">
    <h3>EXECUTED AS A DEED</h3>

    <p style="margin-bottom: 5px;">SIGNED SEALED AND DELIVERED</p>
    <p style="margin-bottom: 5px;">by LOAD LINK AUSTRALIA PTY LIMITED</p>
    <p style="margin-bottom: 5px;">in accordance with section 127 of the</p>
    <p style="margin-bottom: 15px;">Corporations Act and in the presence of:</p>

    <p><strong>Signed:</strong></p>

    <div class="signature-wrapper">
      <div class="signature-box">
        <img src="${data.sig1Base64}" alt="Load Link Signature" class="signature-image" />
        <p style="margin-top: 10px; font-size: 10pt;">Anthony Kousesis<br>Managing Director<br>${data.deedDate}</p>
      </div>
    </div>

    <div style="clear: both;"></div>

    <p style="margin-bottom: 5px;">SIGNED SEALED AND DELIVERED</p>
    <p style="margin-bottom: 5px;">by AJK Engines PTY LTD</p>
    <p style="margin-bottom: 5px;">in accordance with section 127 of the</p>
    <p style="margin-bottom: 15px;">Corporations Act and in the presence of:</p>

    <p><strong>Signed:</strong></p>

    <div class="signature-wrapper">
      <div class="signature-box">
        <img src="${data.sig2Base64}" alt="AJK Engines Signature" class="signature-image" />
        <p style="margin-top: 10px; font-size: 10pt;">Matthew Hunt<br>AJK Engines PTY LTD<br>${data.deedDate}</p>
      </div>
    </div>

    <div style="clear: both;"></div>     
    
  </div>

  <div class="signature-info" style="page-break-before: always;">
      <p><strong>Signed by ${data.repName}</strong><br>
      as authorised representative of <strong>${data.companyName}</strong></p>
    </div>

    <div class="signature-box">
      <img src="${data.signatureBase64}" alt="Signature" class="signature-image" />
      <p style="margin-top: 10px; font-size: 10pt;"><strong>Date:</strong> ${data.deedDate}</p>
    </div>
    
    <div style="clear: both;"></div>
    
    <div class="footer">
      <p>This Confidentiality Deed was generated electronically and is a legally binding document.</p>
      <p>Document generated on ${data.deedDate} for ${data.companyName}</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Send email with PDF attachment to both addresses
async function sendConfidentialityDeedEmails(data: {
  pdfBuffer: Uint8Array;
  companyName: string;
  repName: string;
  email: string;
  deedDate: string;
}) {
  // Create Gmail transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password, not regular password
    },
  });

  const recipients = ["hortondylan010@gmail.com", "dylan@loadlink.com.au"];
  
  console.log("🔵 Attempting to send emails to:", recipients);
  console.log("🔑 Email configured:", !!process.env.EMAIL_USER);
  
  try {
    // Send email with PDF attachment
    const result = await transporter.sendMail({
      from: `"Investor Portal" <${process.env.EMAIL_USER}>`,
      to: recipients.join(", "),
      subject: `Confidentiality Deed - ${data.companyName}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #bb964c; border-bottom: 2px solid #bb964c; padding-bottom: 10px;">
                Kosseris Synergy Confidentiality Deed Signed
              </h2>
              
              <p>Details on completed document:</p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Company:</strong> ${data.companyName}</p>
                <p style="margin: 5px 0;"><strong>Representative:</strong> ${data.repName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
                <p style="margin: 5px 0;"><strong>Date Signed:</strong> ${data.deedDate}</p>
              </div>
              
              <p>Your signed Confidentiality Deed is attached to this email as a PDF Document.</p>
              
              <p style="font-size: 12px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                This is an automated message from the LoadLink Investor Portal.<br>
                Please do not reply to this email.
              </p>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `confidentiality-deed-${data.companyName.replace(/[^a-z0-9]/gi, '_')}.pdf`,
          content: Buffer.from(data.pdfBuffer),
        },
      ],
    });

    console.log("✅ Emails sent successfully to:", recipients.join(", "));
    console.log("📧 Message ID:", result.messageId);
  } catch (error: any) {
    console.error("❌ Error sending emails:", error);
    console.error("Error details:", error.message);
    // Don't throw error - still allow PDF download even if email fails
  }
}
