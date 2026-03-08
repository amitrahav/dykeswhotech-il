# Unify Button Styles Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all ad-hoc button styles with 2 unified styles — Style 1 for dark-background containers, Style 2 for light-background containers.

**Architecture:** Two Tailwind class strings are treated as the canonical button styles and applied consistently. No new components or abstractions needed — just class replacements across 7 files. Close/icon buttons are left untouched (utility-only).

**Tech Stack:** React, TypeScript, Tailwind CSS, shadcn `<Button>` component

---

## The Two Canonical Styles

**Style 1 — On Dark** (dark/colored section backgrounds):
```
rounded-full bg-[#85F2AA] text-[#0B4F2B] font-semibold px-8 py-3 hover:bg-[#6DDEA0] hover:scale-105 active:scale-95 transition-all
```

**Style 2 — On Light** (white/light-gray/glassmorphism backgrounds):
```
rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all
```

**Not changing:**
- Close `✕` buttons (`RegisterModal.tsx`, `TierModal.tsx`) — icon-only utility buttons
- `Events.tsx:192` "Event details" — already Style 1, already correct
- `Events/[event].tsx:142` "Register" — already Style 1, already correct

---

## Task 1: Support.tsx — normalize to Style 1

**File:** `src/components/Support.tsx:23`
**Background:** `#8D49FF` (dark purple) → Style 1

**Step 1: Apply change**

Replace:
```tsx
<Button className="bg-[#85F2AA] text-[#0B4F2B] px-8 py-6 text-xl font-light mb-16 shadow-lg">
```
With:
```tsx
<Button className="rounded-full bg-[#85F2AA] text-[#0B4F2B] font-semibold px-8 py-3 hover:bg-[#6DDEA0] hover:scale-105 active:scale-95 transition-all mb-16">
```

**Step 2: Visual check**
Start dev server and verify the support section button renders as a green pill with dark green text.

**Step 3: Commit**
```bash
git add src/components/Support.tsx
git commit -m "style: unify Support CTA to Style 1 (dark bg)"
```

---

## Task 2: TierModal.tsx — normalize submit + close to Style 1

**File:** `src/components/TierModal.tsx`
**Background:** `#582c99` (deep purple) → Style 1

**Step 1: Apply change to SEND button (line 188)**

Replace:
```tsx
className="flex items-center gap-3 bg-[#2ee66b] hover:bg-[#22d460] disabled:opacity-70 disabled:cursor-not-allowed text-white font-sans font-semibold text-lg px-10 py-4 rounded-full transition-colors cursor-pointer"
```
With:
```tsx
className="flex items-center gap-3 rounded-full bg-[#85F2AA] text-[#0B4F2B] font-semibold px-8 py-3 hover:bg-[#6DDEA0] hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
```

**Step 2: Apply change to Close button (line 216)**

Replace:
```tsx
className="bg-[#2ee66b] hover:bg-[#22d460] text-white font-heading font-bold px-12 py-4 rounded-full text-lg transition-colors cursor-pointer"
```
With:
```tsx
className="rounded-full bg-[#85F2AA] text-[#0B4F2B] font-semibold px-8 py-3 hover:bg-[#6DDEA0] hover:scale-105 active:scale-95 transition-all cursor-pointer"
```

**Step 3: Visual check**
Open Sponsorship page, click a tier CTA, verify modal submit and post-submit close buttons are green pill with dark green text.

**Step 4: Commit**
```bash
git add src/components/TierModal.tsx
git commit -m "style: unify TierModal buttons to Style 1 (dark bg)"
```

---

## Task 3: ContactUs.tsx — normalize submit to Style 1

**File:** `src/components/ContactUs.tsx:80`
**Background:** `#FF66E0` (hot pink dark) → Style 1
**Note:** This button is absolutely positioned inside an input field. Keep all inline `style` positioning — only change the color classes.

**Step 1: Apply change**

Replace the `className` on the `<button>` element:
```tsx
className="absolute bg-[#8D6BE4] hover:bg-[#7a59d1] disabled:opacity-60 text-white font-semibold text-base md:text-lg flex items-center justify-center transition-all z-20"
```
With:
```tsx
className="absolute bg-[#85F2AA] hover:bg-[#6DDEA0] disabled:opacity-60 text-[#0B4F2B] font-semibold text-base md:text-lg flex items-center justify-center transition-all z-20"
```

**Step 2: Visual check**
Go to home page contact section, verify the Send button inside the email input renders green with dark green text, and still sits correctly inside the input.

**Step 3: Commit**
```bash
git add src/components/ContactUs.tsx
git commit -m "style: unify ContactUs send button to Style 1 (dark bg)"
```

---

## Task 4: Sponsorship.tsx — hero CTA to Style 1, tier CTAs to Style 2

**File:** `src/pages/Sponsorship.tsx`

**Step 1: Hero CTA (line ~162) — dark bg `#8D6BE4` → Style 1**

Replace:
```tsx
className="bg-[#c8aef4] text-white font-heading font-extrabold px-8 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-[#b99af0] transition-colors cursor-pointer"
```
With:
```tsx
className="rounded-full bg-[#85F2AA] text-[#0B4F2B] font-semibold px-8 py-3 hover:bg-[#6DDEA0] hover:scale-105 active:scale-95 transition-all cursor-pointer"
```

**Step 2: Tier card CTAs (line ~264, repeated 3×) — glassmorphism/light → Style 2**

Replace:
```tsx
className="bg-[#8a5cf5] text-white font-heading font-bold px-12 py-3 rounded-full text-sm hover:bg-[#7c4ef0] transition-colors cursor-pointer"
```
With:
```tsx
className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all cursor-pointer"
```

**Step 3: Custom Impact CTA (line ~296) — glassmorphism/light → Style 2**

Replace:
```tsx
className="bg-[#8a5cf5] text-white font-heading font-bold px-12 py-3 rounded-full text-sm hover:bg-[#7c4ef0] transition-colors cursor-pointer whitespace-nowrap"
```
With:
```tsx
className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
```

**Step 4: Visual check**
Visit `/sponsorship`, verify:
- Hero CTA is green pill (Style 1)
- All 3 tier CTAs are dark pill (Style 2)
- Custom Impact CTA is dark pill (Style 2)

**Step 5: Commit**
```bash
git add src/pages/Sponsorship.tsx
git commit -m "style: unify Sponsorship buttons — Style 1 hero, Style 2 tier CTAs"
```

---

## Task 5: EventDetail.tsx — 4 buttons across light sections

**File:** `src/pages/Events/EventDetail.tsx`

**Step 1: "Register now" (line 169) — light section bg `#F5F5F5` → Style 2**

Replace:
```tsx
className="bg-[#FF00E5] hover:bg-[#e000cc] text-white font-black px-12 py-8 rounded-full text-xl shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest cursor-pointer"
```
With:
```tsx
className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all cursor-pointer"
```

**Step 2: "View gallery" (line 206) — light section bg `#F5F5F5` → Style 2**

Replace:
```tsx
className="bg-[#FF00E5] hover:bg-[#e000cc] text-white font-black px-10 py-5 rounded-full text-base tracking-widest uppercase cursor-pointer transition-all hover:scale-105 active:scale-95"
```
With:
```tsx
className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all cursor-pointer"
```

**Step 3: "← All events" (line 329) — light section bg `#F5F5F5` → Style 2**

Replace:
```tsx
className="border-2 border-[#293744] text-[#293744] font-black px-10 py-6 rounded-3xl text-lg hover:bg-[#293744] hover:text-white transition-all uppercase tracking-widest font-montserrat"
```
With:
```tsx
className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all"
```
Also remove `variant="outline"` from the `<Button>` element.

**Step 4: "← Back to events" error state (line 99) — light bg `#F5F5F5` → Style 2**

Replace:
```tsx
className="bg-primary text-white px-8 py-4 rounded-2xl text-lg"
```
With:
```tsx
className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all"
```

**Step 5: Visual check**
Visit an event detail page, verify all 4 buttons render as dark pills (Style 2). Also trigger the "not found" state if possible to verify the back button.

**Step 6: Commit**
```bash
git add src/pages/Events/EventDetail.tsx
git commit -m "style: unify EventDetail buttons to Style 2 (light bg)"
```

---

## Task 6: Jobs.tsx — normalize to Style 2

**File:** `src/components/Jobs.tsx:32`
**Background:** `bg-white` → Style 2

**Step 1: Apply change**

Replace:
```tsx
<Button variant="secondary" className="px-8 py-5 rounded-full text-base font-semibold bg-gray-100 hover:bg-gray-200 text-black shadow-sm">
```
With:
```tsx
<Button className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all">
```

**Step 2: Visual check**
Visit home page jobs section, verify CTA is a dark pill.

**Step 3: Commit**
```bash
git add src/components/Jobs.tsx
git commit -m "style: unify Jobs CTA to Style 2 (light bg)"
```

---

## Task 7: AboutUsShort.tsx — normalize to Style 2

**File:** `src/components/AboutUsShort.tsx:21`
**Background:** transparent/white → Style 2

**Step 1: Apply change**

Replace:
```tsx
<Button className="px-6 h-[48px] rounded-md text-sm font-regular text-secondary">
```
With:
```tsx
<Button className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all">
```

**Step 2: Visual check**
Visit home page about section, verify CTA is a dark pill.

**Step 3: Commit**
```bash
git add src/components/AboutUsShort.tsx
git commit -m "style: unify AboutUsShort CTA to Style 2 (light bg)"
```

---

## Final Check

After all 7 tasks:

1. Run `npm run build` — confirm no TypeScript errors
2. Do a full visual pass of these routes:
   - `/` (home) — Support, Jobs, AboutUsShort, ContactUs sections
   - `/sponsorship` — hero, tier cards, custom impact, TierModal
   - `/events/dykeathon` (or any event) — event cards
   - Any event detail page — Register now, View gallery, Back nav

3. Verify no leftover `#FF00E5`, `#8a5cf5`, `#c8aef4`, `#2ee66b`, `#8D6BE4`, `gray-100` colors on primary CTA buttons.
