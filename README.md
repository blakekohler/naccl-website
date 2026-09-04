# NACCL Website

Static site for the National Association of Continuum of Care Leaders (NACCL) — plain HTML and CSS, no build step.

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
