# Contact Us Email Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire up the ContactUs form to send emails via a new `/api/contact` Vercel serverless function.

**Architecture:** Create a new `/api/contact.ts` endpoint following the same Nodemailer + Gmail SMTP pattern as `/api/send-email.ts`. Update `ContactUs.tsx` to POST `{ name, email }` to this endpoint, replacing the current `alert("SOON")` stub with loading/success/error states.

**Tech Stack:** React 19, TypeScript, Vercel Node serverless, Nodemailer, Tailwind CSS

---

### Task 1: Create `/api/contact.ts` serverless function

**Files:**
- Create: `api/contact.ts`
- Reference: `api/send-email.ts` (existing pattern to follow)

**Step 1: Create the file with types and mailer setup**

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

interface ContactBody {
  name: string;
  email: string;
}

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
```

**Step 2: Add the confirmation email template (sent to submitter)**

```typescript
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
                Hey ${data.name}, thanks for joining DykesWhoTech. We'll be in touch soon with updates on our next event.
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
```

**Step 3: Add the internal notification template (sent to team)**

```typescript
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
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">${data.name}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;font-weight:700;color:#582c99;padding:10px 12px;">Email</td>
                  <td style="font-size:14px;color:#1a1a2e;padding:10px 12px;">
                    <a href="mailto:${data.email}" style="color:#8a5cf5;">${data.email}</a>
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
```

**Step 4: Add the handler function**

```typescript
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const data = req.body as ContactBody;

  if (!data?.name || !data?.email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
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
        subject: `[New Contact] ${data.name}`,
        html: internalHtml(data),
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
}
```

**Step 5: Verify TypeScript compiles**

Run: `cd /Users/amitrahav/Dykeathon/dykeathon-website && npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add api/contact.ts
git commit -m "feat: add /api/contact serverless function for community join form"
```

---

### Task 2: Update `ContactUs.tsx` to call `/api/contact`

**Files:**
- Modify: `src/components/ContactUs.tsx`

**Step 1: Add state for loading and status**

Replace the existing `useState` declarations with:

```typescript
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
```

**Step 2: Replace `handleSubmit` with fetch call**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setStatus("idle");

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) throw new Error("Failed");
    setStatus("success");
    setName("");
    setEmail("");
  } catch {
    setStatus("error");
  } finally {
    setLoading(false);
  }
};
```

**Step 3: Update the Send button to show loading state**

Replace the submit button JSX:

```tsx
<button
  type="submit"
  disabled={loading}
  className="absolute bg-[#8D6BE4] hover:bg-[#7a59d1] disabled:opacity-60 text-white font-semibold text-base md:text-lg flex items-center justify-center transition-all z-20"
  style={{
    position: 'absolute',
    right: '8px',
    top: '8px',
    bottom: '8px',
    padding: '0 16px 0 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer'
  }}
>
  {loading ? "Sending…" : <>{" "}Send <SendHorizontal className="ml-1 md:ml-2 w-5 h-5" /></>}
</button>
```

**Step 4: Add success/error feedback below the form**

After the closing `</form>` tag, add:

```tsx
{status === "success" && (
  <p className="mt-4 text-white font-semibold text-base">
    You're in! Check your inbox for a confirmation.
  </p>
)}
{status === "error" && (
  <p className="mt-4 text-white/80 text-base">
    Something went wrong. Please try again.
  </p>
)}
```

**Step 5: Verify the app builds**

Run: `cd /Users/amitrahav/Dykeathon/dykeathon-website && npm run build`
Expected: Build succeeds with no TypeScript errors

**Step 6: Commit**

```bash
git add src/components/ContactUs.tsx
git commit -m "feat: connect ContactUs form to /api/contact email endpoint"
```

---

## Manual Smoke Test

1. Run `npm run dev` and open the site
2. Scroll to the Contact Us section
3. Fill in a name and email, click Send
4. Button should show "Sending…" and be disabled
5. On success: form clears, "You're in!" message appears
6. Check both the submitter inbox and `info@dykeathon.com` for emails

> Note: In dev, the `/api/contact` endpoint won't run unless you use `vercel dev` (requires Vercel CLI). The form wiring and UI states can be verified independently.
