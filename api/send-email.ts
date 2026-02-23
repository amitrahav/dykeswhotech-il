import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

// ── Types ──────────────────────────────────────────────────────────────────
interface SubmissionBody {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  tierName: string;
  tierPrice: string;
}

// ── Mailer setup ───────────────────────────────────────────────────────────
function createTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.GMAIL_USER,   // info@dykeathon.com
      pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password from Google
    },
  });
}

// ── Email templates ────────────────────────────────────────────────────────

/** Confirmation email sent to the person who submitted the form */
function submitterHtml(data: SubmissionBody) {
  return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your DykesWhoTech Partnership Request</title>
</head>
<body style="margin:0;padding:0;background:#f5f0ff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ff;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#582c99;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header bar -->
          <tr>
            <td style="background:#8a5cf5;padding:24px 40px;">
              <p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:0.5px;">
                DykesWhoTech
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">
                🚀 Your partnership request is in motion
              </h1>
              <p style="margin:0 0 28px;font-size:16px;color:#e8d9ff;line-height:1.6;">
                Hey ${data.fullName}, we received your request for the <strong style="color:#c8aef4;">${data.tierName} – ${data.tierPrice}</strong> tier. Our team will review it and reach out to you shortly.
              </p>

              <!-- Summary card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.1);border-radius:12px;padding:24px;margin-bottom:28px;">
                <tr><td>
                  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#c8aef4;text-transform:uppercase;letter-spacing:1px;">Your submission</p>
                  <table width="100%" cellpadding="4" cellspacing="0">
                    <tr>
                      <td style="font-size:14px;color:#e8d9ff;width:110px;vertical-align:top;">Name</td>
                      <td style="font-size:14px;color:#ffffff;font-weight:600;vertical-align:top;">${data.fullName}</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#e8d9ff;vertical-align:top;">Company</td>
                      <td style="font-size:14px;color:#ffffff;font-weight:600;vertical-align:top;">${data.company}</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#e8d9ff;vertical-align:top;">Email</td>
                      <td style="font-size:14px;color:#ffffff;font-weight:600;vertical-align:top;">${data.email}</td>
                    </tr>
                    ${data.phone ? `<tr>
                      <td style="font-size:14px;color:#e8d9ff;vertical-align:top;">Phone</td>
                      <td style="font-size:14px;color:#ffffff;font-weight:600;vertical-align:top;">${data.phone}</td>
                    </tr>` : ""}
                    <tr>
                      <td style="font-size:14px;color:#e8d9ff;vertical-align:top;">Selected tier</td>
                      <td style="font-size:14px;color:#ffffff;font-weight:600;vertical-align:top;">${data.tierName} – ${data.tierPrice}</td>
                    </tr>
                  </table>
                </td></tr>
              </table>

              <!-- What's next -->
              <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#c8aef4;text-transform:uppercase;letter-spacing:1px;">What happens next</p>
              <ul style="margin:0 0 28px;padding-left:20px;color:#e8d9ff;font-size:15px;line-height:1.8;">
                <li>Our partnerships team will review your request</li>
                <li>We'll reach out within 2–3 business days to discuss details</li>
                <li>Questions in the meantime? Reply to this email</li>
              </ul>

              <p style="margin:0;font-size:15px;color:#e8d9ff;line-height:1.7;">
                With love &amp; power,<br/>
                <strong style="color:#ffffff;">The DykesWhoTech Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
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

/** Internal notification email sent to info@dykeathon.com */
function internalHtml(data: SubmissionBody) {
  return `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head><meta charset="UTF-8" /><title>New Partnership Request</title></head>
<body style="margin:0;padding:0;background:#f5f0ff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ff;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;border:2px solid #8a5cf5;">

          <tr>
            <td style="background:#8a5cf5;padding:20px 36px;">
              <p style="margin:0;font-size:18px;font-weight:900;color:#fff;">
                🔔 New Partnership Request
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 36px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;">
                A new sponsor application just came in via the website.
              </p>

              <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
                <tr style="background:#f5f0ff;">
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;border-radius:6px 0 0 6px;width:130px;">Name</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">${data.fullName}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;">Company</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">${data.company}</td>
                </tr>
                <tr style="background:#f5f0ff;">
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;">Email</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">
                    <a href="mailto:${data.email}" style="color:#8a5cf5;">${data.email}</a>
                  </td>
                </tr>
                ${data.phone ? `<tr>
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;">Phone</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">${data.phone}</td>
                </tr>` : ""}
                <tr style="${data.phone ? "" : "background:#f5f0ff;"}">
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;">Tier</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;font-weight:700;">${data.tierName} – ${data.tierPrice}</td>
                </tr>
                <tr style="${data.phone ? "background:#f5f0ff;" : ""}">
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;">Submitted</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">${new Date().toLocaleString("en-IL", { timeZone: "Asia/Jerusalem" })} (IL)</td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:14px;color:#666;">
                Reply directly to <a href="mailto:${data.email}" style="color:#8a5cf5;">${data.email}</a> to follow up.
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

// ── Handler ────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS pre-flight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const data = req.body as SubmissionBody;

  // Basic validation
  if (!data?.fullName || !data?.company || !data?.email || !data?.tierName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = createTransport();

    // Send both emails in parallel
    await Promise.all([
      // 1. Confirmation to the submitter
      transporter.sendMail({
        from: `"DykesWhoTech" <${process.env.GMAIL_USER}>`,
        to: data.email,
        subject: `🚀 Your DykesWhoTech partnership request is in motion`,
        html: submitterHtml(data),
      }),

      // 2. Internal notification to the team
      transporter.sendMail({
        from: `"DykesWhoTech Website" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // info@dykeathon.com
        replyTo: data.email,
        subject: `[New Lead] ${data.fullName} – ${data.tierName} (${data.tierPrice})`,
        html: internalHtml(data),
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
}
