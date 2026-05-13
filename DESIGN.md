---
name: NHN&D Editorial Identity
source: Stitch design system assets/804c6072b6b546328250924797f06a0b (project 1930340481011959365)
synced: 2026-05-12
colors:
  surface: '#f8f9ff'
  surface-dim: '#c2dcff'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dbe9ff'
  surface-container-highest: '#d1e4ff'
  on-surface: '#001d36'
  on-surface-variant: '#43474d'
  inverse-surface: '#17324d'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777e'
  outline-variant: '#c3c6ce'
  surface-tint: '#47607e'
  primary: '#00162c'
  on-primary: '#ffffff'
  primary-container: '#0f2b46'
  on-primary-container: '#7a93b3'
  inverse-primary: '#afc9eb'
  secondary: '#745b1b'
  on-secondary: '#ffffff'
  secondary-container: '#ffdc8e'
  on-secondary-container: '#795f1f'
  tertiary: '#151612'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a2a26'
  on-tertiary-container: '#92918b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#afc9eb'
  on-primary-fixed: '#001d36'
  on-primary-fixed-variant: '#2f4865'
  secondary-fixed: '#ffdf9b'
  secondary-fixed-dim: '#e4c278'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4302'
  tertiary-fixed: '#e5e2db'
  tertiary-fixed-dim: '#c9c6c0'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#474742'
  background: '#f8f9ff'
  on-background: '#001d36'
  surface-variant: '#d1e4ff'
brand-overrides:
  navy: '#0f2b46'
  gold: '#c9a961'
  cream: '#faf7f0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  quote:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
  hairline: 0.5pt
---

## Brand & Style

The brand personality is authoritative, intellectual, and uncompromisingly premium. It is designed to evoke the prestige of a heritage white-shoe law firm mixed with the modern clarity of a top-tier management consultancy. The target audience consists of high-net-worth individuals and corporate executives who value precision over trendiness.

This design system employs a **High-End Editorial Minimalism** style. It rejects the "app-like" aesthetics of shadows and gradients in favor of structural integrity and typographic hierarchy. The user interface should feel like a digital edition of a luxury broadsheet or a bespoke financial report. Visual interest is generated through asymmetrical whitespace, rigorous grid alignment, and the surgical use of thin gold hairlines.

## Colors

The palette is restricted to a triad that signals stability and wealth.

- **Primary (Navy `#0f2b46`):** Used for primary typography, navigation backgrounds, and structural elements. It represents the "ink" of the brand.
- **Accent (Gold `#c9a961`):** Used sparingly for 0.5pt dividers, active states, and small call-to-action highlights. It must never be used for large surfaces.
- **Background (Cream `#faf7f0`):** A warm, paper-like off-white that reduces eye strain and provides a more premium feel than a clinical pure white.
- **Contrast:** High-contrast pairings are mandatory. Use Navy text on Cream backgrounds for long-form reading, and Cream text on Navy blocks for impactful editorial sections.

## Typography

Typography is the primary vehicle for the brand's luxury positioning.

**Playfair Display** (Serif) is reserved for headlines and editorial pull-quotes. It should be typeset with tight letter-spacing in larger formats to emphasize its high-contrast strokes.

**Inter** (Sans-serif) provides the functional backbone. By using the Medium weight (500) as the default for body text, the design system maintains a sense of "weight" and importance even in smaller data points.

Use **Label-Caps** for section headers or small metadata to create a rhythmic "Interruption" in the flow of information, reminiscent of architectural blueprints or tax forms.

## Layout & Spacing

This design system utilizes a **Fixed Grid** philosophy for desktop to ensure line lengths remain optimal for readability (approx. 70-80 characters).

- **Grid:** A 12-column grid with generous 32px gutters.
- **Whitespace:** Use whitespace aggressively to separate sections rather than containment boxes. Vertical rhythm should be based on a baseline of 8px.
- **The Divider:** The 0.5pt gold hairline is a critical component. Use it to separate the header from the body, and to distinguish between different logical sections of a report or article.
- **Mobile:** On mobile, margins shrink to 20px, and the layout collapses to a single column, but the vertical spacing between elements remains generous to maintain the "breathable" editorial feel.

## Elevation & Depth

This design system is strictly **Flat**. Depth is achieved through color layering and scale, not through shadows or blurs.

- **The Layering Rule:** There are only two levels of elevation. The base level (Cream background) and the secondary level (Navy background blocks).
- **No Shadows:** Shadows are prohibited. To highlight an element, use a 0.5pt gold border or a subtle shift in background color (e.g., a slightly darker cream or a navy fill).
- **Outlines:** Use low-contrast Navy outlines (10-20% opacity) for interactive elements like input fields to maintain a "ghostly," architectural precision.

## Shapes

The shape language is **Sharp (0px)**.

Every element—including buttons, input fields, cards, and images—must have perfectly square corners. This rigidity reinforces the brand's association with law, structure, and institutional stability. Avoid any rounded corners or circular elements, as they detract from the serious, editorial tone.

## Components

- **Buttons:** Primary buttons are solid Navy with Cream text. Secondary buttons are transparent with a 1px Navy border. All buttons are rectangular with no radius. Hover states should involve a subtle fill change to Gold.
- **Input Fields:** Minimalist design. A single bottom border of 1px Navy, which turns Gold on focus. Labels are always positioned above the field in "Label-Caps" typography.
- **Cards:** Cards should not have borders or backgrounds. Instead, use a 0.5pt Gold hairline at the top of the card to define its start point in a list.
- **Dividers:** Horizontal hairlines in Gold (#C9A961) at 0.5pt thickness. Vertical dividers can be used in navigation menus to separate high-level categories.
- **Data Tables:** High-density Inter typography. No vertical grid lines. Horizontal lines should be very faint Navy (10% opacity) except for the header, which is underlined with a Gold hairline.
- **Editorial Callouts:** Use Navy background blocks with Cream Playfair Display text for significant insights or partner quotes.

## Voice & Vocabulary

- **4 trụ tone:** tinh tế · học thuật · tự tin không kiêu · đồng cảm
- **KHÔNG dùng:** "lách thuế", "bí mật", "99%", phong cách ép bán
- **DÙNG:** "đề xuất", "phân tích", "dẫn chiếu Thông tư", "tư vấn"
- Tham chiếu phong cách: Deloitte, KPMG, PwC, Bain
