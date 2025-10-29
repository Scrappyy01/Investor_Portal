import React from "react";

const ConfidentialityDeed = () => {
  const deedDate = "21 October 2025";
  const companyName = "AJK Engines PTY LTD";
  const acn = "789 632 145";
  const street = "U44/211 Brisbane Road";
  const state = "Queensland";
  const postcode = "4216";
  const repName = "Matthew Hunt";
  const email = "admin@ajkengines.com.au";
  const signatureBase64 = "data:image/png;base64,..."; 

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <style>{`
          @page {
            margin: 60px 0 160px 0;
          }
          body {
            font-size: 16px;
            line-height: 1.45;
            color: #111;
            text-align: left;
          }
          .ll-cover-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 297mm;
            width: 100%;
            text-align: center;
            position: relative;
            z-index: 1;
          }
          .ll-cover-line {
            margin-bottom: 20px;
            font-size: 22px;
            text-align: center;
          }
          .ll-cover-bold {
            font-weight: bold;
          }
          .ll-cover-title {
            margin-top: 60px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 1px;
            text-align: center;
          }
          .signature-img {
            width: 180px;
            max-height: 60px;
            object-fit: contain;
          }
          .content-container {
            font-family: "Book Antiqua", serif;
            margin: 200px 100px 500px;
            z-index: 1;
            text-align: left;
          }
          .execution-wrapper {
            margin-top: 800px;
            line-height: 1.8;
          }
          .exec-title {
            font-size: 15px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 15px;
          }
          .exec-subtitle {
            font-size: 15px;
            font-weight: bold;
          }
          .exec-note {
            font-size: 14px;
            font-style: italic;
            font-weight: normal;
            margin-left: 8px;
          }
          .exec-block {
            font-family: "Book Antiqua", serif;
            font-size: 11pt;
            line-height: 1.3;
            margin: 0;
            padding: 0;
            text-align: justify;
          }
          .exec-block p {
            margin: 0 0 6pt 0;
          }
        `}</style>
      </head>
      <body>
        <div class="ll-cover-wrapper" style="padding-top: 60mm;">
          <p class="ll-cover-line">Between</p>
          <p class="ll-cover-line ll-cover-bold">Load Link Australia Pty Limited</p>
          <p class="ll-cover-line">and</p>
          <p class="ll-cover-line ll-cover-bold">{companyName}</p>
          <hr style="margin: 2mm 0;" />
          <h2 class="ll-cover-title" style="margin-top: 2mm;">CONFIDENTIALITY DEED</h2>
          <hr style="margin-top: 4mm;" />
          <p style="margin-top: 6mm; font-size: 12pt;">{deedDate}</p>
        </div>

        <div class="content-container">
          <p>THIS DEED is made the day of {deedDate}</p>
          <p>
            BETWEEN: LOAD LINK AUSTRALIA PTY LIMITED (ACN 661 824 175) of Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216 (“Disclosing Party”); and
          </p>
          <p>
            {companyName} (ACN {acn}) of {street}, {state} {postcode} (“Recipient”).
          </p>

          <h3>WHEREAS:</h3>
          <p>A. The Disclosing Party and the Recipient wish to pursue discussions concerning possible transactions between them and to that end it is necessary for the Disclosing Party to provide certain Confidential Information to the Recipient.</p>
          <p>B. The Confidential Information is of significant commercial value to the Disclosing Party.</p>
          <p>C. The Disclosing Party proposes to make the Confidential Information available to the Recipient for the Permitted Purpose subject to and in consideration of the Recipient entering into this Deed.</p>

          <h3>NOW THIS DEED WITNESSES as follows:</h3>
          <h3>13. NOTICES</h3>
          <p>Any notice given under this Deed:</p>
          <p>(a) must be in writing addressed to the intended recipient at the address shown below or the address last notified by the intended recipient to the sender:</p>
          <p>Disclosing Party</p>
          <p>Load Link Australia Pty Limited & Fortis Fundamenta Pty Ltd atf the Fortis Fundamenta Trust</p>
          <p>Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216</p>
          <p><strong>Attention:</strong> Mr Anthony Kosseris</p>
          <p><strong>Email:</strong> anthony@loadlink.com.au</p>

          <p>Recipient</p>
          <p>{companyName}</p>
          <p>{street}, {state} {postcode}</p>
          <p><strong>Attention:</strong> {repName}</p>
          <p><strong>Email:</strong> {email}</p>

          <h3>18. COUNTERPARTS</h3>
          <p>This Deed may be executed in any number of counterparts. All counterparts taken together will be taken to constitute one instrument.</p>
        </div>

        <div class="execution-wrapper">
          <div class="exec-title">EXECUTION CLAUSE</div>

          <div class="exec-block">
            <div class="exec-subtitle">EXECUTED <span class="exec-note">as a Deed.</span></div>
            <p>SIGNED SEALED AND DELIVERED by LOAD LINK AUSTRALIA PTY LIMITED</p>
            <p>in accordance with section 127 of the Corporations Act and in the presence of:</p>
            <p><strong>Signed:</strong></p>
            <img src="/wp-content/uploads/2025/08/signature.png" class="signature-img" alt="Loadlink Signature" />
            <p>Anthony Kousesis<br />Managing Director<br />{deedDate}</p>
          </div>

          <div class="exec-block">
            <p>SIGNED SEALED AND DELIVERED by {companyName} in accordance with section 127 of the Corporations Act and in the presence of:</p>
            <p><strong>Signed:</strong></p>
            <img src={signatureBase64} class="signature-img" alt="User Signature" />
            <p>{repName}<br />{companyName}<br />{deedDate}</p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default ConfidentialityDeed;