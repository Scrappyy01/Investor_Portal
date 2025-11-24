import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { join } from "path";
import React from "react";
import ConfidentialityDeedPDF from "@/app/components/ConfidentialityDeedPDF";

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
    const sig1Base64 = `data:image/png;base64,${sig1Buffer.toString("base64")}`;
    const sig2Base64 = `data:image/png;base64,${sig2Buffer.toString("base64")}`;
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

    // Generate PDF using @react-pdf/renderer
    const pdfDocument = React.createElement(ConfidentialityDeedPDF, {
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
    });

    const pdfBuffer = await renderToBuffer(pdfDocument as any);

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

async function sendConfidentialityDeedEmails(data: {
  pdfBuffer: Uint8Array;
  companyName: string;
  repName: string;
  email: string;
  deedDate: string;
}) {
  // Create SMTP transporter for LoadLink corporate email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const recipients = ["jessica.santos@loadlink.com.au", "dylan@loadlink.com.au"];
  
  console.log("🔵 Attempting to send emails to:", recipients);
  console.log("🔑 Email configured:", !!process.env.EMAIL_USER);
  
  try {
    // Send email with PDF attachment
    const result = await transporter.sendMail({
      from: `"Investor Portal" <${process.env.SMTP_USER}>`,
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

