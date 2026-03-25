import crypto from "crypto";

// ── Notion DB / page IDs ────────────────────────────────────────────────────
export const REGISTRATIONS_DB = "2f3949a289bd80acb7c0e4c7d3d97cf8";
export const PARTICIPANTS_DB  = "2f3949a289bd803498eff8a33106c1fb";
export const EVENT_2026_ID    = "2f3949a2-89bd-8069-9d63-cc031e970722";

// ── Tally payload types ─────────────────────────────────────────────────────
export interface TallyOption { id: string; text: string }
export interface TallyField  { key: string; label: string; type: string; value: unknown; options?: TallyOption[] }
export interface TallyPayload {
  eventType: string;
  data: { createdAt: string; fields: TallyField[] };
}

// ── Field map entry ─────────────────────────────────────────────────────────
type NotionType =
  | "title" | "rich_text" | "url" | "number" | "checkbox"
  | "multi_select" | "date" | "email" | "phone_number" | "select";

// Array-based so multiple entries can share the same tallyLabel (e.g. one
// checkbox group → two Notion properties) or the same Notion target (e.g.
// two questions that both contribute values to one multi_select column).
interface FieldMapEntry {
  tallyLabel: string;
  notion: string;
  type: NotionType;
  /** Optional transform: given raw Tally value + options array, return the value to store */
  transform?: (value: unknown, options: TallyOption[]) => unknown;
}

// ── Helper transforms ───────────────────────────────────────────────────────

/** Resolve selected option IDs → their display texts */
function selectedTexts(value: unknown, options: TallyOption[]): string[] {
  const ids = Array.isArray(value) ? (value as string[]) : [];
  return ids.map(id => options.find(o => o.id === id)?.text ?? id).filter(Boolean);
}

/** Return true if the option whose text matches `needle` is selected */
function isOptionSelected(needle: string, value: unknown, options: TallyOption[]): boolean {
  return selectedTexts(value, options).some(t => t.toLowerCase().includes(needle.toLowerCase()));
}

// ── Participant field map ───────────────────────────────────────────────────
// Used to build the Participants DB page (upserted by email)
export const PARTICIPANT_FIELD_MAP: FieldMapEntry[] = [
  { tallyLabel: "Full Name", notion: "Name",      type: "title" },
  { tallyLabel: "Email",     notion: "Email",     type: "email" },
  { tallyLabel: "Phone",     notion: "Phone",     type: "phone_number" },
  { tallyLabel: "Linkedin",  notion: "LinkedIn",  type: "url" },
];

// ── Registration field map ──────────────────────────────────────────────────
// Each entry maps one Tally field label to one Notion property.
// Multiple entries may share the same tallyLabel (one Tally field → several
// Notion properties) or the same notion target (several Tally fields merged
// into one multi_select column). Update here when the form changes.
export const REGISTRATION_FIELD_MAP: FieldMapEntry[] = [
  { tallyLabel: "Full Name",         notion: "Name",      type: "title" },
  { tallyLabel: "Linkedin",          notion: "LinkedIn",  type: "url" },
  { tallyLabel: "Current workplace", notion: "Workplace", type: "rich_text" },
  { tallyLabel: "Current position",  notion: "Position",  type: "rich_text" },

  {
    tallyLabel: "What are your professional skills?",
    notion: "Skills",
    type: "multi_select",
    transform: selectedTexts,
  },

  {
    tallyLabel: "If you selected 'Other,' please specify.",
    notion: "Skills Notes",
    type: "rich_text",
  },

  {
    tallyLabel: "How long are you in the Tech industry in years?",
    notion: "Years of Experience",
    type: "number",
    transform: (v) => (v !== null && v !== "" ? Number(v) : null),
  },

  // "Do you want to be a PM?" + "Staying Overnight?" both contribute to Interested Roles
  {
    tallyLabel: "Do you want to participate as a Dykeathon product manager?",
    notion: "Interested Roles",
    type: "multi_select",
    transform: (value, options) =>
      isOptionSelected("yes", value, options) ? ["PM"] : [],
  },
  {
    tallyLabel: "Staying Overnight?\uD83D\uDC42",
    notion: "Time Slots",
    type: "multi_select",
    transform: (value, options) => {
      const text = selectedTexts(value, options)[0] ?? "";
      if (text === "Hell Yes")          return ["Staying overnight"];
      if (text === "Unfortunately Not") return ["Not planning to stay overnight"];
      if (text === "Not sure yet")      return ["Not sure about night"];
      return [];
    },
  },

  {
    tallyLabel: "What are your goals for participating in the Dykeathon?",
    notion: "Event Goals",
    type: "multi_select",
    transform: selectedTexts,
  },

  { tallyLabel: "Please specify", notion: "Event Goals Notes", type: "rich_text" },

  {
    tallyLabel: "Food Preferences",
    notion: "Dietary Restrictions",
    type: "multi_select",
    transform: selectedTexts,
  },

  {
    tallyLabel: "Allergies or other food related sensitivities?",
    notion: "Allergies Notes",
    type: "rich_text",
  },

  {
    tallyLabel: "How did you hear about us?\uD83D\uDC42",
    notion: "Referral Source",
    type: "multi_select",
    transform: selectedTexts,
  },

  // One Tally checkbox group → two separate Notion boolean columns
  {
    tallyLabel: "Untitled checkboxes field",
    notion: "Allow Broadcast",
    type: "checkbox",
    transform: (value, options) => isOptionSelected("The Dykeathon", value, options),
  },
  {
    tallyLabel: "Untitled checkboxes field",
    notion: "Allow SMS",
    type: "checkbox",
    transform: (value, options) => isOptionSelected("המרכז הגאה", value, options),
  },

  {
    tallyLabel: "Job Searching",
    notion: "Is Job Searching",
    type: "checkbox",
    transform: (value) => {
      if (typeof value === "string") return value.toLowerCase().includes("looking");
      return false;
    },
  },

  {
    tallyLabel: "CV Upload and share",
    notion: "Share CV with Recruiters",
    type: "checkbox",
    transform: (value, options) => isOptionSelected("approve sharing", value, options),
  },

  {
    tallyLabel: "Untitled file upload field",
    notion: "CV URL",
    type: "url",
    transform: (value) => {
      if (Array.isArray(value) && value.length > 0) {
        const file = value[0] as { url?: string };
        return file?.url ?? null;
      }
      return null;
    },
  },
];

// ── Parse Tally fields into a label-keyed map ───────────────────────────────
export function parseFields(fields: TallyField[]): Map<string, TallyField> {
  const map = new Map<string, TallyField>();
  for (const field of fields) {
    // Tally may emit sub-fields like "Full Name (First)" — index by base label too
    map.set(field.label, field);
  }
  return map;
}

// ── Build Notion properties object from a field map + parsed Tally fields ───
export function buildProperties(
  fieldMap: FieldMapEntry[],
  parsedFields: Map<string, TallyField>,
): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  for (const entry of fieldMap) {
    const field = parsedFields.get(entry.tallyLabel);
    if (!field) continue;

    const rawValue = entry.transform
      ? entry.transform(field.value, field.options ?? [])
      : field.value;

    if (rawValue === null || rawValue === undefined || rawValue === "") continue;
    if (Array.isArray(rawValue) && rawValue.length === 0) continue;

    // Merge into existing multi_select instead of overwriting
    if (entry.type === "multi_select" && props[entry.notion]) {
      const existing = (props[entry.notion] as { multi_select: Array<{ name: string }> }).multi_select;
      const incoming = (Array.isArray(rawValue) ? rawValue : [rawValue]) as string[];
      props[entry.notion] = { multi_select: [...existing, ...incoming.map(name => ({ name }))] };
    } else {
      props[entry.notion] = toNotionProperty(entry.type, rawValue);
    }
  }

  return props;
}

function toNotionProperty(type: NotionType, value: unknown): unknown {
  switch (type) {
    case "title":
      return { title: [{ text: { content: String(value) } }] };
    case "rich_text":
      return { rich_text: [{ text: { content: String(value) } }] };
    case "url":
      return { url: String(value) };
    case "email":
      return { email: String(value) };
    case "phone_number":
      return { phone_number: String(value) };
    case "number":
      return { number: Number(value) };
    case "checkbox":
      return { checkbox: Boolean(value) };
    case "multi_select": {
      const items = Array.isArray(value) ? value : [value];
      return { multi_select: (items as string[]).map(name => ({ name })) };
    }
    case "select":
      return { select: { name: String(value) } };
    case "date":
      return { date: { start: String(value) } };
  }
}

// ── Notion API helpers ──────────────────────────────────────────────────────

function notionHeaders() {
  return {
    "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };
}

async function notionPost(path: string, body: unknown) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion API ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

/** Query Participants DB for a row with matching email. Returns page ID or null. */
export async function findParticipantByEmail(email: string): Promise<string | null> {
  const data = await notionPost(`/databases/${PARTICIPANTS_DB}/query`, {
    filter: { property: "Email", email: { equals: email } },
    page_size: 1,
  }) as { results: Array<{ id: string }> };
  return data.results[0]?.id ?? null;
}

/** Create a new Participant page and return its ID. */
export async function createParticipant(properties: Record<string, unknown>): Promise<string> {
  const page = await notionPost("/pages", {
    parent: { database_id: PARTICIPANTS_DB },
    properties,
  }) as { id: string };
  return page.id;
}

/**
 * Find an existing Registration by participant ID + exact submission timestamp.
 * Returns the page ID if found, null otherwise.
 */
export async function findRegistrationByTimestamp(
  timestamp: string,
  participantId: string,
): Promise<string | null> {
  const data = await notionPost(`/databases/${REGISTRATIONS_DB}/query`, {
    filter: {
      and: [
        { property: "Participant", relation: { contains: participantId } },
        { property: "Registered at", date: { equals: timestamp } },
      ],
    },
    page_size: 1,
  }) as { results: Array<{ id: string }> };
  return data.results[0]?.id ?? null;
}

/** Create a new Registration page. */
export async function createRegistration(properties: Record<string, unknown>): Promise<void> {
  await notionPost("/pages", {
    parent: { database_id: REGISTRATIONS_DB },
    properties,
  });
}

/** Update an existing Registration page's properties. */
export async function updateRegistration(
  pageId: string,
  properties: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion PATCH /pages/${pageId} failed (${res.status}): ${text}`);
  }
}

// ── Tally signature verification ────────────────────────────────────────────
export function verifyTallySignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
