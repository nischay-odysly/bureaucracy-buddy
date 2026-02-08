
# Landing Page Redesign — Premium 2025 AI Startup Aesthetic

## Overview
Complete redesign of the landing page and app color system to match premium AI startups (Stripe, Linear, Anthropic). Moving from colorful bento-grid template style to a calm, confident, editorial design with generous whitespace and strong typography.

## Design System Changes

### Color System
- **Background**: Pure white (#FFFFFF) in light mode, deep neutral dark in dark mode
- **Text**: Near-black (#0A0A0A) headings, neutral gray (#6B7280) body/supporting text
- **Accent**: Single deep indigo/violet (hsl(250, 50%, 50%)) — used sparingly for CTAs and small highlights only
- **Remove**: Coral/orange primary, multi-color bento gradients, animated orbs, glassmorphism

### Typography
- **Headings**: Keep Playfair Display but increase sizing, tighter tracking, bolder weight
- **Body**: Inter stays, but shift to lighter weight (400) with more line-height for calm readability
- **Hierarchy**: Much larger headline sizes (clamp 3rem to 5rem), smaller subdued supporting text

### Spacing
- Generous vertical padding (py-32 to py-40 between sections)
- More whitespace around text blocks
- No visual clutter between sections

---

## Section-by-Section Changes

### Section 1 — Hero (HeroSection.tsx)
- **Remove**: Animated gradient orbs, "Powered by AI" badge, colorful bento preview grid at bottom
- **Keep**: Logo image at top
- **New headline**: "Stop struggling with French bureaucracy."
- **New subheadline**: "Just speak. Bureaucracy Buddy handles the rest."
- **Supporting line**: "From confusion to resolution in seconds."
- **Layout**: Centered, generous vertical spacing, large headline (5rem+), calm supporting text
- **CTA**: Single primary button "Get Started" in the new indigo accent, plus a subtle ghost "See How It Works" link
- **Background**: Clean white, no orbs or decorations

### Section 2 — How It Works (HowItWorksSection.tsx)
- **Remove**: Heavy circular icon containers with gradient backgrounds, bordered step numbers
- **New layout**: Horizontal 3-column flow with thin connecting line
- **Each step**: Small minimal stroke icon (24px), title below, one-line description
- **Steps**: Speak / Understand / Act (keep content, refine descriptions to be shorter)
- **No cards, no boxes** — just icon, text, and whitespace
- **Section header**: Remove or simplify to just "How it works" in smaller, understated text

### Section 3 — Capability Statement (replaces BentoFeaturesSection.tsx)
- **Remove**: Entire bento grid with colored accent bars and hover effects
- **Replace with**: Single powerful statement block
- **Headline**: "Voice-first AI that turns speech into action."
- **Supporting paragraph**: Brief description of multilingual support, document drafting, phone calls, and legal context
- **Layout**: Centered text block, or left-aligned with generous whitespace
- **Optional**: Beneath the statement, 4 minimal inline capabilities listed horizontally (icon + label only, no cards): Multilingual / Instant Drafts / Legal Context / Voice-First

### Section 4 — CTA Footer (CTAFooter.tsx)
- **Simplify**: Remove gradient orb background
- **Keep**: "Ready to simplify your admin?" headline, CTA button, footer links
- **Restyle**: Button in new indigo accent, cleaner footer layout

---

## CSS / Tailwind Changes (index.css + tailwind.config.ts)

### CSS Variables (index.css)
- Update `--primary` from coral (16 85% 56%) to deep indigo (250 50% 50%)
- Update `--accent` to a softer violet complement
- Update `--ring` to match new primary
- Remove bento color variables (--bento-1 through --bento-6)
- Simplify `.gradient-primary` to a subtle indigo gradient or solid color
- Update `.gradient-text` to use indigo tones
- Remove `.glass-card` class (or simplify to plain card)
- Remove `orb-float` and `gradient-shift` keyframes
- Update `.section-heading` and `.hero-heading` sizing for larger, more editorial feel

### Dark Mode
- Update dark mode variables to complement the new indigo palette
- Darker, more neutral background (keep 240 6% 4% or shift slightly)

---

## App Page Color Sync (AppPage.tsx, MicButton.tsx, BackgroundDecor.tsx)

### BackgroundDecor.tsx
- Tone down to very subtle, single-color soft glow or remove entirely
- Use the new indigo at very low opacity if kept

### MicButton.tsx
- Update `gradient-primary` usage — will automatically pick up new indigo primary
- Recording state (destructive red) stays the same

### AppPage.tsx
- No structural changes needed — colors will cascade from CSS variable updates
- The glass-card loading indicator will inherit the cleaner styling

---

## Files Modified

| File | Change |
|------|--------|
| `src/index.css` | New color variables, remove bento vars, update gradient classes, remove orb keyframes, update typography sizing |
| `tailwind.config.ts` | Update any hardcoded color references if present |
| `src/components/landing/HeroSection.tsx` | Full rewrite — new copy, remove orbs/badge/bento grid, clean layout |
| `src/components/landing/PainPointsSection.tsx` | Remove entirely (merged into capability section) |
| `src/components/landing/HowItWorksSection.tsx` | Simplify to minimal horizontal timeline, remove heavy icon containers |
| `src/components/landing/BentoFeaturesSection.tsx` | Replace with single capability statement section |
| `src/components/landing/CTAFooter.tsx` | Remove gradient orb, update button color |
| `src/pages/Index.tsx` | Remove PainPointsSection import, update section order |
| `src/components/BackgroundDecor.tsx` | Simplify to very subtle single glow |

## What Stays the Same
- Routing structure and page architecture
- AppPage functionality (voice/text/call)
- Legal pages (Privacy, Terms, Contact)
- Framer Motion for subtle entrance animations (but toned down)
- Logo images
- Footer links and navigation
