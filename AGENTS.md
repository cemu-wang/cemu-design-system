# Cemu Design System implementation rules

- Use the existing Figma styles in `src/tokens/figma-styles.json` as the source of truth for typography, shadows, focus rings, blur, gradients and layout grids. The snapshot comes from Figma file `eygiBSiA9xJvYwxZWLeno7`. Refresh it from Figma when the user requests a sync; do not invent new style values.
- Import `src/styles/index.css` once at the application/Storybook entry point. Do not import only `tokens.css` when rendering components.
- Use `Text` (`src/components/Text/Text.tsx`) for new text, or the generated `.text-{size}-font-{weight}` classes. In component CSS, use the complete `--text-{size}-font-{weight}` font shorthand and its letter-spacing token. Do not introduce independent font sizes, weights or line heights for text.
- Typography mode follows `lang="en"`, `lang="zh-CN"` or `data-typography="english|chinese"`. Keep typography mode separate from content translation. English uses the bundled Geist Mono; Chinese uses the user's installed PingFang UI SC, with PingFang SC/system fallbacks. Do not redistribute Apple fonts.
- Use the generated effect/gradient variables and classes, e.g. `--shadow-sm`, `--focus-ring-primary`, `--blur-sm`, `--backdrop-blur-sm`, `--gradient-primary`. Theme is selected with `data-theme="light|dark"`. Preserve bound theme colors.
- Keep raw Figma definitions and binding IDs in the snapshot. Generated CSS is checked in for direct use, but must be regenerated with `npm run tokens:build`, never manually edited.
- Follow `docs/styles.md` for usage and CSS translation limits. Check `Foundations/Styles` in Storybook to inspect all imported styles.
- Preserve existing user work. Work on the feature branch. Do not merge into `main` without explicit user approval after validation.
