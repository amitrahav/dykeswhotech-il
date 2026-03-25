import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  TallyPayload,
  EVENT_2026_ID,
  PARTICIPANT_FIELD_MAP,
  REGISTRATION_FIELD_MAP,
  parseFields,
  buildProperties,
  findParticipantByEmail,
  createParticipant,
  findRegistrationByTimestamp,
  createRegistration,
  updateRegistration,
  verifyTallySignature,
} from "./_lib/tally-to-notion.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // ── Signature verification ──────────────────────────────────────────────
  const secret = process.env.TALLY_SIGNING_SECRET;
  if (secret) {
    const signature = req.headers["tally-signature"] as string | undefined;
    const rawBody = JSON.stringify(req.body);
    if (!signature || !verifyTallySignature(rawBody, signature, secret)) {
      return res.status(401).json({ error: "Invalid signature" });
    }
  }

  // ── Parse payload ───────────────────────────────────────────────────────
  const payload = req.body as TallyPayload;
  if (payload.eventType !== "FORM_RESPONSE") {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const { fields, createdAt } = payload.data;
  const parsedFields = parseFields(fields);

  const emailField = parsedFields.get("Email");
  const email = typeof emailField?.value === "string" ? emailField.value.trim() : "";
  if (!email) {
    return res.status(400).json({ error: "Missing email in submission" });
  }

  try {
    // ── 1. Find or create Participant ─────────────────────────────────────
    let participantId = await findParticipantByEmail(email);
    if (!participantId) {
      const participantProps = buildProperties(PARTICIPANT_FIELD_MAP, parsedFields);
      participantId = await createParticipant(participantProps);
    }

    // ── 2. Build Registration properties ─────────────────────────────────
    const registrationProps = buildProperties(REGISTRATION_FIELD_MAP, parsedFields);

    // Inject fixed/derived properties
    registrationProps["Registered at"] = { date: { start: createdAt } };
    registrationProps["Source Year"] = { select: { name: "2026" } };
    registrationProps["Event"] = { relation: [{ id: EVENT_2026_ID }] };
    registrationProps["Participant"] = { relation: [{ id: participantId }] };

    // ── 3. Upsert Registration (update if same timestamp exists, else create) ─
    const existingId = await findRegistrationByTimestamp(createdAt, participantId);
    if (existingId) {
      await updateRegistration(existingId, registrationProps);
    } else {
      await createRegistration(registrationProps);
    }

    return res.status(200).json({ success: true, action: existingId ? "updated" : "created" });
  } catch (err) {
    console.error("tally-registration error:", err);
    return res.status(500).json({ error: "Failed to write to Notion" });
  }
}
