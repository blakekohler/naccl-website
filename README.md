# NACCL Website

Static site for the National Association of Continuum of Care Leaders (NACCL) — plain HTML and CSS, no build step.

## Source of truth

The documents in `docs/` govern everything on this site:

- `NACCL_Brand_Direction_8-24-26.docx` — the approved brand standard (colors, typography, voice)
- `NACCL_Brand_Specification_8-24-26.docx` — implementation detail: hex values, contrast rules, derived web colors, naming and voice rules
- `About NACCL and FAQs August 2026.docx` — the content source: facts, numbers, dates, quotes, and FAQ copy

Site copy should be traceable to these documents. Do not invent resources, events, quotes, or claims that aren't in them. Key voice rules: the association is NACCL and the people are the CoC Network; use CoC casing (never COC); spell state names in full; never all caps; NACCL complements existing national organizations and avoids "ending homelessness" language.

## Structure

- `index.html` — home: where things stand, why NACCL exists, timeline, interim leadership
- `about.html` — About NACCL and full FAQs
- `membership.html` — eligibility, dues, governance
- `resources.html` — resource library and toolkits
- `advocacy.html` — advocacy and narrative
- `policy.html` — Policy Desk (add updates at the top of the Updates section)
- `events.html` — December 8 national convening and ongoing formats
- `connect.html` / `contact.html` / `share.html` — Netlify-powered forms (submissions appear in the Netlify dashboard under Forms)
- `css/styles.css` — all styling, brand tokens defined as CSS variables at the top

## Brand

Follows the NACCL Brand Specification (8-24-26):

- Palette: orange `#C65D00` (display only), slate `#2E4A62`, gold `#C4953A` (fills only, never text), charcoal `#2D2D2D`, light gray `#E0DEDA`, cream `#FDF6ED`
- Links and small orange text use the text-safe variant `#BE5900`
- Type: Carlito (Google Fonts), falling back to Calibri, then sans-serif
- Section bars are bold white on solid slate, normal case — never all caps (it breaks CoC casing)

## Deploy

Hosted on Netlify. Deploy with:

```
netlify deploy --prod --dir .
```
