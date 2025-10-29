import puppeteer from "puppeteer";
import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import ReactDOMServer from "react-dom/server";
import ConfidentialityDeed from "../../onboarding/confidentiality-deed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Incoming PDF request body:", req.body);

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
    } = req.body;

    const requiredFields = {
      companyName,
      acn,
      street,
      state,
      postcode,
      repName,
      email,
      deedDate,
      signatureBase64
    };

    const missing = Object.entries(requiredFields).filter(([key, value]) => {
      if (typeof value !== "string") return true;
      if (key === "signatureBase64") return !value.startsWith("data:image");
      return value.trim() === "";
    });

    if (missing.length > 0) {
      console.warn("Missing or invalid fields:", missing.map(([key]) => key));
      return res.status(400).json({
        message: "Missing or invalid fields",
        fields: missing.map(([key]) => key)
      });
    }

    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ConfidentialityDeed, {
        companyName,
        acn,
        street,
        state,
        postcode,
        repName,
        email,
        deedDate,
        signatureBase64
      })
    );

    if (!html || html.length < 100) {
      console.error("Generated HTML is empty or invalid");
      return res.status(500).json({ message: "Failed to render HTML" });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=confidentiality-deed.pdf");
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
}