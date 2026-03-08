# Cloudinary Event Gallery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the placeholder gallery grid in EventDetail with the Cloudinary Product Gallery widget, driven by a per-event `galleryTag` in `events.json`, while preserving the existing section layout.

**Architecture:** Each `singleEvent` in `events.json` gains an optional `galleryTag` string. `EventDetail.tsx` gains a `useCloudinaryGallery` hook that dynamically loads the Cloudinary Product Gallery script and mounts the widget into a container `<div>` inside the existing gallery section. The section is hidden when `galleryTag` is absent.

**Tech Stack:** Cloudinary Product Gallery widget (CDN script), React `useEffect`, Vite env vars, TypeScript.

---

### Task 1: Document the env var in `.env.example`

**Files:**
- Modify: `.env.example`

**Step 1: Add the Cloudinary section to `.env.example`**

Append after the PostHog block:

```
# ──────────────────────────────────────────────────────────────────────────────
# Cloudinary — Product Gallery
# ──────────────────────────────────────────────────────────────────────────────
# Find your cloud name in Cloudinary → Settings → Account
# In Vercel: Settings → Environment Variables → add VITE_CLOUDINARY_CLOUD_NAME
# ──────────────────────────────────────────────────────────────────────────────

VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: document VITE_CLOUDINARY_CLOUD_NAME in .env.example"
```

---

### Task 2: Add `galleryTag` to `events.json`

**Files:**
- Modify: `src/content/events.json`

**Step 1: Add `galleryTag` to the four dykeathon singleEvents that have photos**

The `galleryTag` value must match the tag you add to images in Cloudinary Media Library (see Task 4).

Add to `id: "2026"`:
```json
"galleryTag": "dykeathon-2026"
```

Add to `id: "2024"`:
```json
"galleryTag": "dykeathon-2024"
```

Add to `id: "2023"`:
```json
"galleryTag": "dykeathon-2023"
```

Add to `id: "2022"`:
```json
"galleryTag": "dykeathon-2022"
```

Leave `id: "2025"`, `id: "hanukkah-2023"`, and `id: "nov-2024"` without a `galleryTag` — their gallery sections will be hidden automatically.

**Step 2: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/content/events.json','utf8')); console.log('valid')"
```

Expected output: `valid`

**Step 3: Commit**

```bash
git add src/content/events.json
git commit -m "content: add galleryTag to dykeathon singleEvents"
```

---

### Task 3: Add `useCloudinaryGallery` hook and update gallery section

**Files:**
- Modify: `src/pages/Events/EventDetail.tsx`

**Step 1: Add the hook after `useTallyEmbed` (around line 76)**

The hook mirrors the existing `useTallyEmbed` pattern: inject the script once, initialize and render the widget on load, destroy on cleanup.

```typescript
// ────────────────────────────────────────────────────────────────
// Cloudinary Product Gallery loader hook
// ────────────────────────────────────────────────────────────────
function useCloudinaryGallery(galleryTag?: string, containerId?: string) {
    useEffect(() => {
        if (!galleryTag || !containerId) return;

        const SCRIPT_SRC = "https://product-gallery.cloudinary.com/all.js";
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        let gallery: any = null;

        const initGallery = () => {
            // @ts-ignore
            if (typeof window.cloudinary === "undefined") return;
            // @ts-ignore
            gallery = window.cloudinary.galleryWidget({
                container: `#${containerId}`,
                cloudName,
                mediaAssets: [{ tag: galleryTag }],
            });
            gallery.render();
        };

        if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
            const s = document.createElement("script");
            s.src = SCRIPT_SRC;
            s.onload = initGallery;
            document.body.appendChild(s);
        } else {
            initGallery();
        }

        return () => {
            gallery?.destroy();
        };
    }, [galleryTag, containerId]);
}
```

**Step 2: Call the hook inside `EventDetail`**

Below the existing `useTallyEmbed(singleEvent?.tallyId)` call, add:

```typescript
const galleryContainerId = `cloudinary-gallery-${eventId}`;
useCloudinaryGallery(singleEvent?.galleryTag, singleEvent?.galleryTag ? galleryContainerId : undefined);
```

**Step 3: Replace the gallery section (lines 197–214)**

Replace the entire gallery `<section>` block with this — outer wrapper is preserved exactly, only the inner content changes:

```tsx
{/* ═══════════════════════════════════════
     GALLERY SECTION
═══════════════════════════════════════ */}
{singleEvent.galleryTag && (
    <section className="relative z-10 bg-[#F5F5F5] px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
            <div id={galleryContainerId} className="w-full" />
        </div>
    </section>
)}
```

**Step 4: Verify the dev server compiles without errors**

```bash
npm run dev
```

Expected: no TypeScript errors, server starts on http://localhost:5173

**Step 5: Manual verification**

1. Navigate to `http://localhost:5173/events/dykeathon/2024`
   - Gallery section should render the Cloudinary Product Gallery widget with images tagged `dykeathon-2024`
2. Navigate to `http://localhost:5173/events/dykeathon/2025`
   - Gallery section should be hidden (no `galleryTag`)
3. Navigate to `http://localhost:5173/events/meetups/nov-2024`
   - Gallery section should be hidden

**Step 6: Commit**

```bash
git add src/pages/Events/EventDetail.tsx
git commit -m "feat: replace gallery placeholder with Cloudinary Product Gallery widget"
```

---

### Task 4: Tag images in Cloudinary (manual — one-time per event)

This is a user action, not code. For each event folder in the Cloudinary Media Library:

1. Open Cloudinary Media Library → navigate to the event folder (e.g. "dykeathon 2024")
2. Select all images (Ctrl+A / Cmd+A)
3. Click **Manage** → **Add tag** → enter the tag matching `galleryTag` in events.json (e.g. `dykeathon-2024`)
4. Repeat for each event folder

The widget will now display those images on the corresponding event detail page.
