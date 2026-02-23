# Contact Us Bar — Email Integration Design

**Date:** 2026-02-23
**Status:** Approved

## Summary

Connect the bottom `ContactUs` section's form submission to a new Vercel serverless function that sends emails via Nodemailer + Gmail SMTP.

## Context

- Existing `/api/send-email.ts` handles sponsorship tier submissions (requires `company`, `tierName`, `tierPrice`)
- `ContactUs.tsx` collects only `name` + `email` for a community join signup
- Both use the same Gmail SMTP credentials (`GMAIL_USER`, `GMAIL_APP_PASSWORD` env vars)

## Architecture

### New endpoint: `/api/contact.ts`

- Mirrors the pattern of `/api/send-email.ts`
- Accepts `POST { name: string, email: string }`
- Sends two emails in parallel via Nodemailer:
  1. Confirmation to the submitter
  2. Internal notification to `info@dykeathon.com`
- Returns `{ success: true }` on success, `{ error: string }` on failure

### Updated component: `ContactUs.tsx`

- Replace `alert("SOON")` with a `fetch` call to `/api/contact`
- Add `loading` state — disable button and show spinner during submission
- Add `status` state — show inline success message or error message after submission
- No new fields; keep existing `name` + `email` inputs

## Data Flow

```
User fills name + email
  → Submit triggers fetch POST /api/contact
  → API validates, sends emails via Gmail SMTP
  → Returns success/error JSON
  → UI shows confirmation or error message
```

## Email Templates

**Confirmation (to submitter):** Matches brand (purple/pink), thanks them for joining, sets expectation the team will be in touch.

**Internal notification (to team):** Shows name, email, and timestamp in IL timezone.

## Error Handling

- Client: show inline error text if fetch fails or API returns error
- API: validate required fields, catch nodemailer errors, return 500 with message

## Environment Variables Required

- `GMAIL_USER` — already set for sponsorship flow
- `GMAIL_APP_PASSWORD` — already set for sponsorship flow
