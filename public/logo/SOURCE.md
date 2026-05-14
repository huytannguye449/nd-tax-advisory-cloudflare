# Logo Asset Source — NHN&D Tax Advisory

**LOCK FILE — DO NOT EDIT LOGO SVG BY HAND.**

All logo files in `public/logo/*.svg` (plus `app/icon.svg`, `app/apple-icon.svg`) are binary downloads from Stitch project `1930340481011959365` ("NHN&D Editorial Identity"), commit-locked by SHA256 checksum. AI must not redraw `<text>` / `<path>` content of these SVGs.

## Stitch source mapping (synced 2026-05-14)

| Local file | Source | Notes |
|---|---|---|
| `public/logo/logo-primary.png` | User-provided PNG (2026-05-14, ChatGPT export, alpha-transparent, 1536×1024 → resized to 800px wide) | Replaced Stitch SVG. Source preserved at `_logo-source-original.png` |
| `public/logo/logo-horizontal.png` | Duplicate of `logo-primary.png` | Same lockup, used for mobile header |
| `public/logo/logo-executive.png` | Duplicate of `logo-primary.png` | Same lockup, used for hero/about emphasis |
| `public/logo/logo-app-icon.svg` | `8442b28ae1df4606837c3619ecd6a598` | NHN&D App Icon - Primary Navy (512×512) | Stitch download |
| `public/logo/logo-social.svg` | `5092b51c04e04976850acbf977a1ece1` | NHN&D Social Avatar - Stacked Monogram (512×512) | Stitch download |
| `public/logo/logo-favicon.svg` | `efccce7322ec45aea652faa63247a4fa` | NHN&D Favicon - Light Mode (512×512) | Stitch download |
| `app/icon.svg` | `efccce7322ec45aea652faa63247a4fa` | Same as `logo-favicon.svg` (Next.js auto-favicon) | Stitch download |
| `public/logo/logo-reversed.svg` | — (derived) | Derived from `logo-primary.svg` | Deterministic color swap |

Apple touch icon (`<link rel="apple-touch-icon">`) is wired via `metadata.icons.apple = "/logo/logo-app-icon.svg"` in `app/layout.tsx` (Next.js convention does not auto-detect `apple-icon.svg`, so this points at the existing Stitch SVG instead of duplicating it).

## Derivation rule for `logo-reversed.svg`

Applied to `logo-primary.svg` content:
- `fill="#FFFFFF"` (background rect) → `fill="#0F2B46"` (navy)
- `fill="#0F2B46">NHN` → `fill="#FAF7F0">NHN` (cream)
- `fill="#1A1A1A">Tax` → `fill="#FAF7F0">Tax` (cream)
- `fill="#1A1A1A">Advisory` → `fill="#FAF7F0">Advisory` (cream)
- Gold accents (`#C9A961`) unchanged: `&D` text + vertical divider stroke

If `logo-primary.svg` is re-synced from Stitch, regenerate `logo-reversed.svg` by re-applying the swap above.

## SHA256 checksums (2026-05-14)

```
1da06eb965077381f3cf19234e95bc3a3ba04633fe5663cecf40089701112e3a  public/logo/logo-app-icon.svg
cc90ab2be15adb1dcd3d442fe311e164fbc24f396e7ed9b8fbf651bdd3a004be  public/logo/logo-executive.svg
5a36baace7c393207ea59932e098c216407ebb07ffa6ab10cb98c613c1af354c  public/logo/logo-favicon.svg
f12096acb1da1f6554d3dc81952136fb6b5d931e19f71bc2ec3bbc5ecacb4717  public/logo/logo-horizontal.svg
6a35f46008d31c223a3867b8b8b32fa6fe07aa0922e6aa52d7123a802450576f  public/logo/logo-primary.svg
42830a78fe0bf8efbd03e4ac3f5e51c40c966745088fef6849d73ff3f47784ae  public/logo/logo-reversed.svg
5e327b22deee1d10f8b7677fdf2c66af1432fb1959a89fdb3db3fac2dce98b3f  public/logo/logo-social.svg
b78cea1a06e99dddc62a59e974a6e2d3b6117b8ca2e5c11540b971419d0a3ceb  app/icon.svg
```

Verify: `shasum -a 256 public/logo/*.svg app/icon.svg`

## Update procedure

When Stitch design system changes:

1. `mcp__stitch__list_screens` projectId `1930340481011959365` — list current screens
2. For each screen with `mimeType: image/svg+xml`, copy the `downloadUrl` and `curl -sL -o` it to the appropriate local path (mapping above)
3. Regenerate `logo-reversed.svg` via the color-swap rule
4. Recompute checksums: `shasum -a 256 public/logo/*.svg app/icon.svg app/apple-icon.svg` and update this file
5. Commit with message `chore(brand): re-sync logo from Stitch <YYYY-MM-DD>`

## Hard rules (enforced by AGENTS.md)

- ❌ NEVER write `<svg><text x="..." y="..." font-size="...">NHN` by hand in `.tsx`, `.svg`, or anywhere else.
- ❌ NEVER add `rx`/`ry` (rounded corners), `Helvetica`, `Arial`, or any non-Playfair/Inter font in logo SVG (DESIGN.md "Sharp 0px" + brand fonts).
- ❌ NEVER edit `logo-*.svg` content directly. Update = re-download from Stitch.
- ✅ React/Next consumers render logo via `<img src="/logo/logo-<variant>.svg" />` (see `components/shared/logo.tsx`).
- ✅ `logo-reversed.svg` is the only derived file; if `logo-primary.svg` changes, regenerate via the color-swap rule.
