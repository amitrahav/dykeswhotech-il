# Design: Cloudinary Product Gallery per Event

**Date:** 2026-03-08

## Summary

Replace the placeholder gallery grid in `EventDetail.tsx` with the Cloudinary Product Gallery widget, driven by a per-event `galleryTag` in `events.json`. The surrounding section layout and styling are preserved.

---

## 1. Data Layer — `events.json`

Add an optional `galleryTag` string to each `singleEvent`:

```json
{ "id": "2024", "galleryTag": "dykeathon-2024", ... }
{ "id": "2023", "galleryTag": "dykeathon-2023", ... }
{ "id": "2022", "galleryTag": "dykeathon-2022", ... }
{ "id": "2026", "galleryTag": "dykeathon-2026", ... }
```

Events with no gallery photos yet omit `galleryTag` entirely. The gallery section is hidden when `galleryTag` is absent — same conditional pattern used for the partners section.

---

## 2. Configuration

Cloudinary cloud name is site-wide, stored as a Vite env variable:

```
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

No API key or secret required. The Product Gallery widget is purely client-side and only needs the cloud name (which is public).

---

## 3. Component — `EventDetail.tsx`

### Script loading

A `useCloudinaryGallery` hook (defined in `EventDetail.tsx`) mirrors the existing `useTallyEmbed` pattern:
- Dynamically injects `<script src="https://product-gallery.cloudinary.com/all.js">` once
- On load, calls `window.cloudinary.galleryWidget({ ... }).render()`
- On unmount, calls `.destroy()` to clean up

### Initialization

```js
window.cloudinary.galleryWidget({
  container: `#cloudinary-gallery-${eventId}`,
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  mediaAssets: [{ tag: singleEvent.galleryTag }],
})
```

Container id uses `eventId` (e.g. `cloudinary-gallery-2024`) to avoid conflicts.

### Layout preservation

The gallery `<section>` keeps its existing wrapper:
- `bg-[#F5F5F5]`, padding, `max-w-7xl` container — unchanged
- The placeholder grid (25 grey squares) and "View gallery" button are **replaced** by a `<div id="cloudinary-gallery-{eventId}">` mounting point
- The section is hidden entirely when `singleEvent.galleryTag` is absent

---

## 4. User Setup (one-time)

For each event folder in Cloudinary (e.g. "dykeathon 2024"):
1. Open the folder in Cloudinary Media Library
2. Select all images → Add tag matching the `galleryTag` value (e.g. `dykeathon-2024`)

---

## Files to Modify

| File | Change |
|------|--------|
| `src/content/events.json` | Add `galleryTag` to relevant singleEvents |
| `src/pages/Events/EventDetail.tsx` | Add `useCloudinaryGallery` hook, replace gallery placeholder with widget container |
| `.env` (new, gitignored) | Add `VITE_CLOUDINARY_CLOUD_NAME` |
| `.env.example` (new) | Document the env var for other developers |
