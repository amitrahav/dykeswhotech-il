import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

interface ContactBody {
  name: string;
  email: string;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function createTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function submitterHtml(data: ContactBody) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Welcome to DykesWhoTech</title></head>
<body style="margin:0;padding:0;background:#f5f0ff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ff;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#582c99;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#FF66E0;padding:24px 40px;">
              <p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:0.5px;">DykesWhoTech</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 16px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">
                You're in! 🎉
              </h1>
              <p style="margin:0 0 24px;font-size:16px;color:#e8d9ff;line-height:1.6;">
                Hey ${esc(data.name)}, thanks for joining DykesWhoTech. We'll be in touch soon with updates on our next event.
              </p>
              <p style="margin:0;font-size:15px;color:#e8d9ff;line-height:1.7;">
                With love &amp; power,<br/>
                <strong style="color:#ffffff;">The DykesWhoTech Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.15);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.45);text-align:center;">
                DykesWhoTech · info@dykeathon.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function internalHtml(data: ContactBody) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Contact Submission</title></head>
<body style="margin:0;padding:0;background:#f5f0ff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ff;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;border:2px solid #FF66E0;">
          <tr>
            <td style="background:#FF66E0;padding:20px 36px;">
              <p style="margin:0;font-size:18px;font-weight:900;color:#fff;">🔔 New Contact Submission</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 36px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;">Someone signed up via the website contact form.</p>
              <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
                <tr style="background:#f5f0ff;">
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;width:100px;">Name</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">${esc(data.name)}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;">Email</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">
                    <a href="mailto:${esc(data.email)}" style="color:#8a5cf5;">${esc(data.email)}</a>
                  </td>
                </tr>
                <tr style="background:#f5f0ff;">
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;">Submitted</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">${new Date().toLocaleString("en-IL", { timeZone: "Asia/Jerusalem" })} (IL)</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const data = req.body as ContactBody;

  if (!data?.name?.trim() || !data?.email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(data.email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const safeName = data.name.trim().replace(/[\r\n]+/g, " ");
    const transporter = createTransport();

    await Promise.all([
      transporter.sendMail({
        from: `"DykesWhoTech" <${process.env.GMAIL_USER}>`,
        to: data.email,
        subject: `Welcome to DykesWhoTech! 🎉`,
        html: submitterHtml(data),
      }),
      transporter.sendMail({
        from: `"DykesWhoTech Website" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: data.email,
        subject: `[New Contact] ${safeName}`,
        html: internalHtml(data),
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
}
