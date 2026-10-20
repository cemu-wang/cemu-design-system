
import fs from "node:fs"

// 读取 Tokens Studio 导出的 JSON
const tokens = JSON.parse(
  fs.readFileSync("src/tokens/123.json", "utf8")
)

// 选择需要使用的 Token 集合
const sources = [
  tokens["PrimaryColor/Blue"],
  tokens["SecondaryColor/Blue"],
  tokens["GrayColor/Gray"],
  tokens["PrimitivesColor/Mode 1"],
]

// 解析 Token 引用，例如 {blue.500}
function resolve(node) {
  const value = node?.$value ?? node

  if (typeof value !== "string") return value

  const match = value.match(/^\{([^{}]+)\}$/)
  if (!match) return value

  for (const source of sources) {
    const found = match[1]
      .split(".")
      .reduce((obj, key) => obj?.[key], source)

    if (found !== undefined) return resolve(found)
  }

  throw new Error(`Unresolved token: ${value}`)
}

// 获取 Light 模式与尺寸 Token
const light = tokens["ThemeColor/Light"]
const primary = tokens["PrimaryColor/Blue"]
const dimensions = tokens["Dimensions/Default"]

// 定义当前需要生成的 CSS 变量
const variables = {
  "--color-primary": resolve(light.Background.Primary.default),
  "--color-primary-foreground": resolve(light["Text&Shape"].Primary.foreground),
  "--color-primary-hover": resolve(primary.Light["primary-strong"]),
  "--color-secondary": resolve(light.Background.Secondary.default),
  "--color-secondary-foreground": resolve(light["Text&Shape"].Secondary.foreground),
  "--color-text": resolve(light["Text&Shape"].Nnormal.default),
  "--color-background": resolve(light.Background.Nnormal.default),
  "--color-border": resolve(light.Border.Nnormal.default),
  "--radius-sm": `${resolve(dimensions["border-radius"].xs)}px`,
  "--spacing-16": `${resolve(dimensions.spacing["16"])}px`,
}

// 转换为 CSS Variables
const css = [
  ":root {",
  ...Object.entries(variables).map(
    ([name, value]) => `  ${name}: ${value};`
  ),
  "}",
].join("\n")

// 创建目录并写入 CSS 文件
fs.mkdirSync("src/styles", { recursive: true })
fs.writeFileSync("src/styles/tokens.css", css + "\n")

console.log("Design Tokens generated!")
