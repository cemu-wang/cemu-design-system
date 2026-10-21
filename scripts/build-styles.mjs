import fs from "node:fs"

const source = JSON.parse(fs.readFileSync("src/tokens/figma-styles.json", "utf8"))
const variables = new Map(source.variables.map(v => [v.id, v]))
const colors = new Map(source.styleColors.map(v => [v.id, v]))
const number = value => Number(value.toFixed(6))
const px = value => `${number(value)}px`
const nameOf = style => style.name.split("/").at(-1)
const textName = style => style.name.replaceAll("/", "-")
const rule = (selector, values) => `${selector} {\n${Object.entries(values).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`
const rgba = color => {
  if (!color || ![color.r, color.g, color.b, color.a ?? 1].every(Number.isFinite)) throw Error("Invalid style color")
  return `rgba(${[color.r, color.g, color.b].map(v => Math.round(v * 255)).join(", ")}, ${number(color.a ?? 1)})`
}
function valueFor(binding, mode, fallback) {
  if (!binding) return fallback
  const variable = variables.get(binding.id)
  if (!variable || !(mode in variable.valuesByMode)) throw Error(`Missing typography binding ${binding.id}`)
  return variable.valuesByMode[mode]
}
const typography = source.collections.find(c => c.name === "Typography")
function typographyVariables(mode) {
  const values = {}
  const familyVariable = source.variables.find(v => v.name === "font-family")
  const family = familyVariable.valuesByMode[mode.modeId]
  values["--font-family"] = mode.name === "Chinese"
    ? `${JSON.stringify(family)}, "PingFang SC", system-ui, sans-serif`
    : `${JSON.stringify(family)}, "PingFang UI SC", "PingFang SC", monospace`
  for (const v of source.variables) {
    if (v.name === "font-family") continue
    const value = v.valuesByMode[mode.modeId]
    values[`--${v.name.replaceAll("/", "-")}`] = v.name.startsWith("font-weight/") ? value : px(value)
  }
  for (const s of source.textStyles) {
    const n = textName(s)
    const bindings = s.boundVariables ?? {}
    const size = valueFor(bindings.fontSize, mode.modeId, s.fontSize)
    const height = valueFor(bindings.lineHeight, mode.modeId, s.lineHeight.value)
    const weight = valueFor(bindings.fontWeight, mode.modeId, s.fontName.variationSettings?.wght)
    if (!Number.isFinite(weight)) throw Error(`Missing weight: ${s.name}`)
    const sizeRef = bindings.fontSize ? `var(--${variables.get(bindings.fontSize.id).name.replaceAll("/", "-")})` : px(size)
    const heightRef = bindings.lineHeight ? `var(--${variables.get(bindings.lineHeight.id).name.replaceAll("/", "-")})` : s.lineHeight.unit === "AUTO" ? "normal" : s.lineHeight.unit === "PERCENT" ? number(height / 100) : px(height)
    const weightRef = bindings.fontWeight ? `var(--${variables.get(bindings.fontWeight.id).name.replaceAll("/", "-")})` : weight
    values[`--${n}`] = `${weightRef} ${sizeRef}/${heightRef} var(--font-family)`
    values[`--${n}-letter-spacing`] = s.letterSpacing.unit === "PERCENT" ? `${number(s.letterSpacing.value / 100)}em` : px(s.letterSpacing.value)
    values[`--${n}-paragraph-spacing`] = px(s.paragraphSpacing)
    values[`--${n}-paragraph-indent`] = px(s.paragraphIndent)
  }
  return values
}
function colorFor(item, theme) {
  const binding = item.boundVariables?.color
  if (!binding) return rgba(item.color)
  const entry = colors.get(binding.id)
  if (!entry) throw Error(`Unresolved style color ${binding.id}`)
  return rgba(entry[theme])
}
function shadow(effect, theme) {
  if (!['DROP_SHADOW', 'INNER_SHADOW'].includes(effect.type)) throw Error(`Unsupported shadow ${effect.type}`)
  return `${effect.type === "INNER_SHADOW" ? "inset " : ""}${px(effect.offset.x)} ${px(effect.offset.y)} ${px(effect.radius)} ${px(effect.spread ?? 0)} ${colorFor(effect, theme)}`
}
function gradient(paint, theme) {
  if (paint.type !== "GRADIENT_RADIAL") throw Error(`Unsupported gradient ${paint.type}`)
  const [[a, b, tx], [c, d, ty]] = paint.gradientTransform
  const determinant = a * d - b * c
  if (Math.abs(determinant) < 1e-8) throw Error("Singular gradient transform")
  // Inverse of Figma's local-to-gradient transform. These exported ellipses
  // are axis aligned (their gradient axes are rotated 90 degrees).
  if (Math.abs(a) > 1e-6 || Math.abs(d) > 1e-6) throw Error("Rotated ellipse requires an SVG paint implementation")
  const cx = (d * (.5 - tx) - b * (.5 - ty)) / determinant
  const cy = (-c * (.5 - tx) + a * (.5 - ty)) / determinant
  const rx = Math.hypot(d, b) / Math.abs(determinant) / 2
  const ry = Math.hypot(c, a) / Math.abs(determinant) / 2
  return `radial-gradient(ellipse ${number(rx * 100)}% ${number(ry * 100)}% at ${number(cx * 100)}% ${number(cy * 100)}%, ${paint.gradientStops.map(s => `${colorFor(s, theme)} ${number(s.position * 100)}%`).join(", ")})`
}
function effectVariables(theme) {
  const values = {}
  for (const s of source.effectStyles) {
    const effects = s.effects.filter(e => e.visible !== false)
    const n = nameOf(s)
    if (n.startsWith("blur-") || n.startsWith("backdrop-blur-")) {
      if (effects.length !== 1) throw Error(`Unexpected blur stack ${s.name}`)
      values[`--${n}`] = px(effects[0].radius)
    } else values[`--${n}`] = effects.map(e => shadow(e, theme)).join(", ") || "none"
  }
  for (const s of source.paintStyles) {
    const paints = s.paints.filter(p => p.visible !== false)
    if (paints.some(p => p.opacity !== 1 || p.blendMode !== "NORMAL")) throw Error(`Unsupported paint composition ${s.name}`)
    values[`--${nameOf(s)}`] = paints.map(p => gradient(p, theme)).join(", ")
  }
  return values
}
const en = typography.modes.find(m => m.name === "English")
const zh = typography.modes.find(m => m.name === "Chinese")
const css = [
  "/* Generated from src/tokens/figma-styles.json. Run npm run tokens:build. */",
  rule(':root, [lang|="en"], [data-typography="english"]', typographyVariables(en)),
  rule('[lang|="zh"], [data-typography="chinese"]', typographyVariables(zh)),
  rule(':root, [data-theme="light"]', effectVariables("light")),
  rule('[data-theme="dark"]', effectVariables("dark")),
]
for (const s of source.textStyles) {
  const n = textName(s)
  const cases = { ORIGINAL: "none", UPPER: "uppercase", LOWER: "lowercase", TITLE: "capitalize", SMALL_CAPS: "none" }
  const decorations = { NONE: "none", UNDERLINE: "underline", STRIKETHROUGH: "line-through" }
  css.push(rule(`.${n}, [data-text-style="${s.name}"]`, {
    font: `var(--${n})`, "letter-spacing": `var(--${n}-letter-spacing)`,
    "text-indent": `var(--${n}-paragraph-indent)`, "text-transform": cases[s.textCase],
    "text-decoration": decorations[s.textDecoration],
    "font-variant-caps": s.textCase === "SMALL_CAPS" ? "small-caps" : "normal",
  }))
  css.push(rule(`.${n} > p + p, [data-text-style="${s.name}"] > p + p`, { "margin-block-start": `var(--${n}-paragraph-spacing)` }))
}
for (const s of source.effectStyles) {
  const n = nameOf(s)
  const properties = n.startsWith("backdrop-blur-") ? { "backdrop-filter": `blur(var(--${n}))`, "-webkit-backdrop-filter": `blur(var(--${n}))` }
    : n.startsWith("blur-") ? { filter: `blur(var(--${n}))` } : { "box-shadow": `var(--${n})` }
  css.push(rule(`.${n}`, properties))
}
for (const s of source.paintStyles) css.push(rule(`.${nameOf(s)}`, { "background-image": `var(--${nameOf(s)})` }))
const gridValues = {}
for (const s of source.gridStyles) {
  const n = s.name.includes("Desktop") ? "desktop" : "mobile"
  const [g] = s.layoutGrids
  if (g.pattern !== "COLUMNS" || g.alignment !== "CENTER") throw Error(`Unsupported grid ${s.name}`)
  gridValues[`--grid-${n}-columns`] = g.count
  gridValues[`--grid-${n}-column-width`] = px(g.sectionSize)
  gridValues[`--grid-${n}-gutter`] = px(g.gutterSize)
  gridValues[`--grid-${n}-width`] = px(g.count * g.sectionSize + (g.count - 1) * g.gutterSize)
  css.push(rule(`.grid-${n}`, { display: "grid", "grid-template-columns": `repeat(var(--grid-${n}-columns), minmax(0, 1fr))`, gap: `var(--grid-${n}-gutter)`, width: "100%", "max-width": `var(--grid-${n}-width)`, "margin-inline": "auto" }))
}
css.splice(5, 0, rule(":root", gridValues))
fs.writeFileSync("src/styles/figma-styles.css", css.join("\n\n") + "\n")
console.log(`Figma styles generated: ${source.textStyles.length} text, ${source.effectStyles.length} effects, ${source.paintStyles.length} gradients, ${source.gridStyles.length} grids.`)
