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

The initial catalog contains 20 common icons. Names use Google's snake_case
and are checked by TypeScript. Inspect Components/Icon/Gallery in Storybook.

## Source and updates

Official repository: https://github.com/google/material-design-icons

Pinned revision: `49d4db35df873165d6bd6ba09b063c7dafbac2f4`.
Source path: `symbols/web/{name}/materialsymbolsrounded/{name}_24px.svg`.
The unqualified 24px assets use weight 400, grade 0 and fill 0.
Google's Apache 2.0 license is retained in `src/components/Icon/LICENSE`.

`icon-data.ts` retains the official SVG path data without redrawing. To add an
icon, fetch its SVG at the pinned revision, preserve its viewBox and path data,
and add its paths to the typed catalog. Keep the same settings. The existing
catalog uses viewBox `0 -960 960 960`; check this before adding new assets.
No external font, CDN or Google request is needed at runtime.
