# NHN&D Tax Advisory — Logo Assets

## Status

**Stitch v3 pure-typography variant shipped 2026-05-12.**
No more corner brackets or checkmark decoration. All SVGs are now clean wordmark-only lockups based on the Stitch "NHN&D Editorial Identity" design system.

Stitch project: https://stitch.withgoogle.com/projects/1930340481011959365

---

## SVG files (current — Stitch v3)

| File | Dimensions | Description |
|---|---|---|
| `logo-primary.svg` | 600 × 240 | Stacked Playfair NHN/&D + vertical gold divider + Inter Tax/Advisory. Cream `#FAF7F0` background. |
| `logo-horizontal.svg` | 600 × 100 | Inline lockup: Inter NHN + Playfair italic & (gold) + Inter D, with TAX ADVISORY small-caps below. No background. |
| `logo-mono.svg` | 600 × 240 | Same layout as primary, all fills navy `#0F2B46`. Cream background. For single-colour print. |
| `logo-reversed.svg` | 600 × 240 | Navy `#0F2B46` background, NHN cream, &D gold, tagline cream. For dark-surface use. |

All SVGs embed Google Fonts via `<defs><style>@import url(...)` so they render correctly when opened standalone (outside the Next.js font pipeline).

---

## PNG files (STALE — legacy bracketed design)

`logo-primary.png`, `logo-horizontal.png`, `logo-mono.png`, `logo-reversed.png` are **still the old corner-bracket + checkmark design**. They have not been regenerated.

PNG rasterisation requires `rsvg-convert`, Inkscape, or a Playwright screenshot pass — flagged for the design team to regenerate from the new SVGs above.

Do not use the PNG files in new page templates until they are updated.

---

## Color tokens

| Token | Hex | Usage |
|---|---|---|
| Navy | `#0F2B46` | Primary wordmark, body text on light bg |
| Gold | `#C9A961` | `&D` accent, divider line |
| Cream | `#FAF7F0` | Page background, reversed text |
| Charcoal | `#1A1A1A` | Tax/Advisory tagline (primary variant) |

---

*Updated: 2026-05-12*
