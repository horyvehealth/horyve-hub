# Hormonal Health Hub — Website

Bilingual (English/French) one-page website for She-rimenopause & He-Andropause.
Created in Montreal, Canada.

NOTE: This WEBSITE is bilingual (English/French) — toggle with the FR/EN
button in the navigation. The She-rimenopause and He-Andropause APPS
themselves support THREE languages: English, French, and Spanish.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | The page — all structure, clean (no inline text blocks) |
| `styles.css` | All styling — colors, fonts, layout |
| `translations.js` | ALL website text in English & French — edit text here |
| `main.ts` | TypeScript source — edit logic here in IntelliJ/VS Code |
| `main.js` | Compiled JS — ready to upload, used by the browser |
| `tsconfig.json` | IDE config for TypeScript intellisense |

---

## How editing works now

`index.html` only contains short IDs like:
```html
<h1 data-i18n="your_hormones_are_changing">Your Hormones Are Changing...</h1>
```

All the actual English and French text lives in `translations.js`:
```javascript
"your_hormones_are_changing": {
  en: "Your Hormones Are Changing. You Deserve Real Answers.",
  fr: "Vos Hormones Changent. Vous Méritez de Vraies Réponses."
},
```

To edit any text on the site (English or French), open `translations.js`,
find the matching id, and edit the en/fr values. You don't need to touch
index.html for text changes.

---

## How to upload to GitHub Pages

1. Go to github.com and create a new repository
2. Name it `yourusername.github.io` (or any name for a sub-page)
3. Upload ALL files: index.html, styles.css, translations.js, main.js, tsconfig.json
4. Go to Settings → Pages → set source to "main" branch
5. Your site is live at `yourusername.github.io`

---

## Layout overview (matches your design screenshots)

1. Hero — full background, centered title, trust badges, dots
2. "I've been where you are" — 3-column intro (Symptom Tracking / Doctor Reports / Mental Health)
3. She-rimenopause — IMAGE LEFT, description + buy buttons RIGHT (pink)
4. He-Andropause — description + buy buttons LEFT, IMAGE RIGHT (sage)
5. His & Hers Bundle — $57, dark band
6. "It's All So Easy" — 3 alternating feature rows (image/text)
7. "Why You Should Work With Me" — full banner + numbered 01-06 list + image
8. About (Monique's story) — text + photo placeholder
9. Reviews — 3 placeholder testimonials
10. Newsletter signup placeholder (Brevo/Mailchimp)
11. Contact + social links grid
12. Footer with privacy/legal disclaimer

---

## Placeholders to replace

### Product links (search and replace in index.html)
- `PAYHIP_SHE_LINK_HERE`, `GUMROAD_SHE_LINK_HERE`, `ETSY_SHE_LINK_HERE`
- `PAYHIP_HE_LINK_HERE`, `GUMROAD_HE_LINK_HERE`, `ETSY_HE_LINK_HERE`
- `PAYHIP_BUNDLE_LINK_HERE`, `GUMROAD_BUNDLE_LINK_HERE`

### Social / store links
- `PINTEREST_LINK_HERE`, `INSTAGRAM_LINK_HERE`, `LINKEDIN_LINK_HERE`
- `PAYHIP_STORE_LINK_HERE`, `GUMROAD_STORE_LINK_HERE`, `ETSY_STORE_LINK_HERE`
- `PAYPAL_LINK_HERE`, `STRIPE_LINK_HERE`

### Contact
- `YOUR_EMAIL_HERE` (appears twice)

### Images — each placeholder div has a comment above it explaining
exactly what `<img>` tag to use as a replacement:
- She-rimenopause section image (woman / product mockup)
- He-Andropause section image (man / product mockup)
- 3 feature row mockups (symptom tracker, doctor report, wellness tools)
- Full-width "Why Trust Us" banner photo
- "Why you should work with me" lifestyle photo
- Your founder photo in the About section

### Reviews
- Replace the 3 placeholder testimonials with real customer reviews
  (in both `index.html` for default English text AND `translations.js`
  for the French translation)

### Newsletter
- Replace the `nl-ph` div with your Brevo or Mailchimp embed code

---

## Editing in IntelliJ or VS Code

Open the whole folder in your IDE. `tsconfig.json` is auto-detected by both
editors, giving you full TypeScript intellisense in `main.ts`.

If you edit `main.ts`, recompile with:
```
tsc -p tsconfig.json
```
This regenerates `main.js`. Or edit `main.js` directly for quick fixes.

---

## Security features built in

- Content Security Policy meta tag (blocks script injection)
- All external links use rel="noopener noreferrer"
- No eval(), no unsafe innerHTML on user input
- HTML sanitizer on all translated strings (allows only <br> and <em>)
- No data collection — no forms, no server, no database
- Buyer payment data goes to Payhip/Gumroad/Etsy — never touches this site
