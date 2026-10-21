# Shared styles

Source: [Cemu's Design System](https://www.figma.com/design/eygiBSiA9xJvYwxZWLeno7/Cemu-s-Design-System).
`src/tokens/figma-styles.json` records local style names, IDs, keys, values, variable bindings, Typography modes and resolved Light/Dark colors (snapshot: 2026-10-21).

Run `npm run tokens:build` to generate semantic tokens and style CSS. This also runs before application/Storybook development and production builds. A Figma edit is not fetched automatically: refresh the JSON snapshot from the file, then regenerate. Existing `123.json` remains the source for the semantic color/dimension tokens.

Import `src/styles/index.css` once. Prefer the `Text` component:

```tsx
<Text as="h2" size="2xl" weight="semibold">Heading</Text>
<Text as="p" size="sm" lang="zh-CN">中文正文</Text>
<div className="text-sm-font-medium shadow-sm">Content</div>
```

The 36 Figma names `text-xs/font-regular` through `text-8xl/font-semibold` map to `.text-xs-font-regular` etc. Exact names also work as `data-text-style="text-xs/font-regular"`. Each class applies font, line height, weight, letter spacing, indentation, case and decoration. Paragraph spacing is applied to consecutive direct child paragraphs.

Component CSS uses complete text styles:

```css
.label {
  font: var(--text-sm-font-medium);
  letter-spacing: var(--text-sm-font-medium-letter-spacing);
}
.panel { box-shadow: var(--shadow-md); }
.control:focus-visible { box-shadow: var(--focus-ring-primary); }
.glass { backdrop-filter: blur(var(--backdrop-blur-sm)); }
.accent { background-image: var(--gradient-primary); }
```

Use `data-theme="light|dark"` and `data-typography="english|chinese"` on the root or a preview container. Explicit `lang="en"` / `lang="zh-CN"` selects typography too. Nested language/theme scopes reset their respective styles. Typography mode does not translate strings. Geist Mono is self-hosted as a variable WOFF2 with its OFL license. PingFang UI SC is referenced by its actual family name and is not bundled; devices without it fall back to PingFang SC/system fonts.

Imported effects: 8 shadows, 7 layer blurs, 7 backdrop blurs and 9 focus rings. Three radial gradients preserve stop positions and use the inverse Figma transform for ellipse geometry. Bound colors have distinct Light/Dark output. CSS shadow rendering may differ from Figma at antialiased/transparent shape edges; layer blur uses CSS `filter`, and background blur uses `backdrop-filter` on a translucent surface. Blur values are exported in CSS pixels directly; browser and Figma kernels can differ. Grid helpers use 12 columns/24px gutters (1320px reference width) and 2 columns/16px gutters (344px reference width). They preserve the reference sizes at maximum width and become fluid below it; no breakpoint is invented as a Figma token.

Preview all imported styles in Storybook under `Foundations/Styles`. The toolbar changes typography and color modes for every story. Legacy `src/stories` files are Storybook's tutorial examples and are not the project's component library.

## Button and Slot bindings

Button source: Figma page `22106:2652`, component set `11020:4994`.
Slot source: Figma page `10778:5825`, component set `9003:4973`.

| Size | Button label style | Button height | Icon slot | Icon artwork |
| --- | --- | --- | --- | --- |
| SM | text-xs/font-medium (12/16, 500) | 32px | 16 × 16px | 16 × 16px |
| MD | text-sm/font-medium (14/20, 500) | 40px | 20 × 20px | 18 × 18px |
| LG | text-base/font-medium (16/24, 500) | 48px | 24 × 24px | 20 × 20px |

Button labels use the shared Text component. Icon Slot contains no text layer; it inherits typography and color from its parent. Only `type="icon"` is currently supported in both Slot and Button's startSlotType/endSlotType. Other Slot types and text content are deliberately unavailable until their components are implemented. Start/end content remains ReactNode for API compatibility, but Button renders only valid icon elements, so boolean visibility flags or strings cannot create empty leading/trailing slots. Unsupported runtime Slot types render nothing.

Hover/Active uses the three shared gradient styles. Soft and Outline use `backdrop-blur-lg` (16px), matching the Figma effect style. Focus uses the appropriate shared focus-ring style; PrimaryOutline's focus surface follows the Figma reference. CSS horizontal padding compensates for the inside Figma stroke so a 1px border does not add 2px to the auto-layout width.

Preview `Components/Button/Sizes` and `Components/Slot/AllVariants` to inspect the exact size mappings. Their play functions verify text metrics and icon geometry in the browser. `node scripts/check-button-slot.mjs` checks public types, icon-only Slot restrictions and server-rendered Button behavior without launching a browser.
