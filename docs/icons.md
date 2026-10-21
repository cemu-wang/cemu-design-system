# Icons

Use `Icon` from `src/components/Icon/Icon.tsx` for interface icons.
The source is Google's Material Symbols **Rounded**, fixed to **FILL 0,
wght 400, GRAD 0, opsz 24**, matching the selected design settings.
Do not mix with legacy Material Icons or other Material Symbols families.

```tsx
<Icon name="search" aria-label="搜索" />
<Button startSlot={<Icon name="add" />}>Add item</Button>
<Button iconOnly startSlot={<Icon name="close" />} aria-label="关闭" />
<Slot size="md"><Icon name="search" /></Slot>
```

Standalone icons default to 24px. Slot controls actual artwork sizes of
16/18/20px for sm/md/lg. Optical size stays 24 regardless of rendered size.
SVG fill uses `currentColor`; themes and disabled states inherit parent colors.
Icons are decorative by default. Supply `aria-label` or `aria-labelledby` for
standalone meaningful icons; icon-only buttons need a label on the button.

The complete pinned catalog contains 4,301 icons. Names use Google's snake_case
and are checked by TypeScript. Components/Icon/Gallery supports name search,
60 icons per page, selection, and a live Button preview. Button controls also
list the complete catalog.

## Source and updates

Official repository: https://github.com/google/material-design-icons

Pinned revision: `49d4db35df873165d6bd6ba09b063c7dafbac2f4`.
Source path: `symbols/web/{name}/materialsymbolsrounded/{name}_24px.svg`.
The unqualified 24px assets use weight 400, grade 0 and fill 0.
Google's Apache 2.0 license is retained in `src/components/Icon/LICENSE`.

`icon-data.ts` keeps the original 20 common SVGs synchronous. Other icons are
exported from Google's Rounded variable font at the exact fixed axes above,
then served as local JSON SVG paths in `public/icons/material-symbols-rounded`.
`load-icon.ts` fetches only requested icons, caches successful responses and
shares concurrent requests. Switching names never shows the previous glyph.
Icon dimensions are reserved while loading. Uncached icons are client-loaded;
server rendering includes their SVG container until hydration. Common icons
render synchronously on the server too. Failed loads set `data-icon-status="error"`.
The full asset directory ships with the app; it is not added to the initial JS
bundle. Keep it when deploying, including under a Vite base path.

## Reproduce the full catalog

Install `fonttools==4.67.0` in a Python environment. Download
`variablefont/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].ttf` from the pinned
Google revision above, then run:

```sh
python3 scripts/build-icons.py /path/to/MaterialSymbolsRounded.ttf
```

The generator uses the checked-in upstream codepoint list and emits all paths,
the TypeScript name union, and a manifest with source revision, axes and font
SHA-256. Normal npm builds use checked-in outputs and require neither Python nor
network access. Google fonts and CDNs are not requested at runtime.
