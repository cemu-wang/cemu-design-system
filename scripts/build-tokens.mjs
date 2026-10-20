
import fs from "node:fs"

// 读取 Tokens Studio 源数据
const tokens = JSON.parse(
  fs.readFileSync("src/tokens/123.json", "utf8")
)

const sets = [
  tokens["PrimaryColor/Base"],
  tokens["SecondaryColor/Blue"],
  tokens["GrayColor/Gray"],
  tokens["PrimitivesColor/Mode 1"],
  tokens["Opacity/Mode 1"],
]

// 解析别名和 rgba 颜色
function resolve(node) {
  const value = node?.$value ?? node
  if (typeof value !== "string") return value

  const ref = value.match(/^\{([^{}]+)\}$/)

  if (ref) {
    for (const set of sets) {
      const found = ref[1].split(".").reduce(
        (obj, key) => obj?.[key], set
      )
      if (found !== undefined) return resolve(found)
    }
    throw new Error(`Unresolved token: ${value}`)
  }

  const rgba = value.match(/^rgba\((.*),\s*(.*)\)$/)

  if (rgba) {
    const color = resolve(rgba[1].trim())
    let alpha = Number(resolve(rgba[2].trim()))
    if (alpha > 1) alpha /= 100

    const hex = /^#([a-f0-9]{6})$/i.exec(color)
    if (!hex || !Number.isFinite(alpha)) {
      throw new Error(`Invalid rgba token: ${value}`)
    }

    const h = hex[1]
    const channels = [0, 2, 4].map(
      (i) => parseInt(h.slice(i, i + 2), 16)
    )

    return `rgba(${channels.join(", ")}, ${alpha})`
  }

  return value
}

const light = tokens["ThemeColor/Light"]
const primary = tokens["PrimaryColor/Base"]
const dims = tokens["Dimensions/Default"]
const typography = tokens["Typography/English"]

const px = (node) => `${resolve(node)}px`

// Figma Semantic Token → CSS Variables
const variables = {
  "--color-primary": resolve(light.Background.Primary.default),
  "--color-primary-foreground": resolve(light["Text&Shape"].Primary.foreground),
  "--color-primary-hover": resolve(primary.Light["primary-muted"]),

  "--color-secondary": resolve(light.Background.Secondary.default),
  "--color-secondary-hover": resolve(light.Background.Secondary.muted),
  "--color-secondary-foreground": resolve(light["Text&Shape"].Secondary.foreground),

  "--color-surface": resolve(light.Background.Nnormal.default),
  "--color-soft": resolve(light.Background.Nnormal.muted),
  "--color-soft-hover": resolve(light.Background.Nnormal.subtle),

  "--color-text": resolve(light["Text&Shape"].Nnormal.emphasis),
  "--color-text-strong": resolve(light["Text&Shape"].Nnormal.intense),
  "--color-border": resolve(light.Border.Nnormal.default),
  "--color-border-strong": resolve(light.Border.Nnormal.strong),

  "--color-destructive": resolve(light.Background.Error.default),
  "--color-destructive-hover": resolve(light.Background.Error.muted),
  "--color-destructive-foreground": resolve(light["Text&Shape"].Error.foreground),

  "--focus-primary": resolve(light.Effects["primary-focus-ring"]),
  "--focus-secondary": resolve(light.Effects["secondary-focus-ring"]),
  "--focus-default": resolve(light.Effects["focus-ring"]),
  "--focus-destructive": resolve(light.Effects["error-focus-ring"]),

  "--font-family": JSON.stringify(resolve(typography["font-family"])),
  "--font-weight-medium": resolve(typography["font-weight"].medium),
  "--font-size-xs": px(typography["font-size"].xs),
  "--font-size-sm": px(typography["font-size"].sm),
  "--font-size-base": px(typography["font-size"].base),
  "--line-height-xs": px(typography["line-height"].xs),
  "--line-height-sm": px(typography["line-height"].sm),
  "--line-height-base": px(typography["line-height"].base),

  "--radius-sm": px(dims["border-radius"].sm),
  "--radius-md": px(dims["border-radius"].md),
  "--radius-lg": px(dims["border-radius"].lg),

  ...Object.fromEntries(
    ["2", "4", "6", "12", "14", "16"].map(
      (n) => [`--spacing-${n}`, px(dims.spacing[n])]
    )
  ),
}

const css = [
  ":root {",
  ...Object.entries(variables).map(
    ([name, value]) => `  ${name}: ${value};`
  ),
  "}",
].join("\n")

fs.mkdirSync("src/styles", { recursive: true })
fs.writeFileSync("src/styles/tokens.css", css + "\n")

console.log("Design Tokens generated!")
