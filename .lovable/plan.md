

# Bureaucracy Buddy - Rebrand and Content Update

## Overview
Rename the app from "AdminHero" to "Bureaucracy Buddy", integrate the uploaded logo images, add legal/contact pages, fix interactive elements, and update landing page content to reflect the broader scope (calls + emails).

---

## Changes

### 1. Add Logo Assets
- Copy `image-2.png` (logo with text) to `src/assets/logo-full.png`
- Copy `image-3.png` (icon only) to `src/assets/logo-icon.png`
- Use the full logo in the Hero section header area and footer
- Use the icon-only version as favicon and smaller branding spots

### 2. Rename to "Bureaucracy Buddy"
Update all references from "AdminHero" to "Bureaucracy Buddy":
- `index.html` -- title, meta tags, OG tags, twitter tags
- `HeroSection.tsx` -- badge area, any text references
- `CTAFooter.tsx` -- footer brand name, copyright
- `PainPointsSection.tsx` -- any mentions
- `AppPage.tsx` -- any title/header references

### 3. "See How It Works" Smooth Scroll
- In `HeroSection.tsx`, make the "See How It Works" button scroll to the HowItWorksSection
- Add an `id="how-it-works"` to the HowItWorksSection wrapper
- Use `document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })` on click

### 4. Update Step 03 in HowItWorksSection
Current: "Act" -- "Get a perfectly formatted French letter or email, ready to send immediately."
Updated: "Act" -- "Get a drafted email, a phone call made on your behalf, or step-by-step guidance -- whatever it takes to resolve your issue." (Use a more general action icon like `CheckCircle` or `Rocket`)

### 5. Update "Multilingual" Feature in BentoFeaturesSection
Current: "Speak in English, Arabic, Spanish, or any language. Get flawless French output every time."
Updated: "Speak in English, Arabic, Spanish, or any language. We understand you and communicate with French administration on your behalf."

### 6. Create Templated Legal Pages
Create three new page components:
- **`src/pages/PrivacyPage.tsx`** -- Standard privacy policy template for Bureaucracy Buddy
- **`src/pages/TermsPage.tsx`** -- Standard terms of service template
- **`src/pages/ContactPage.tsx`** -- Contact page with email nishuastic@gmail.com and a simple contact form UI

### 7. Add Routes and Wire Footer Links
- Add `/privacy`, `/terms`, `/contact` routes in `App.tsx`
- Update footer links in `CTAFooter.tsx` to use `react-router-dom` `Link` components pointing to these routes
- Also wire the CTA "Get Started" button to navigate to `/app`

---

## Technical Details

**Files to create:**
- `src/assets/logo-full.png` (copied from upload)
- `src/assets/logo-icon.png` (copied from upload)
- `src/pages/PrivacyPage.tsx`
- `src/pages/TermsPage.tsx`
- `src/pages/ContactPage.tsx`

**Files to modify:**
- `index.html` -- title and meta tags
- `src/App.tsx` -- add 3 new routes
- `src/components/landing/HeroSection.tsx` -- logo, smooth scroll, rename
- `src/components/landing/HowItWorksSection.tsx` -- update step 03 text and icon, add section id
- `src/components/landing/BentoFeaturesSection.tsx` -- update Multilingual description
- `src/components/landing/CTAFooter.tsx` -- logo, rename, Link components, wire CTA button
- `src/pages/AppPage.tsx` -- rename references

