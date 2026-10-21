import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"
import { Text } from "../components/Text/Text"
import type { TextSize, TextWeight } from "../components/Text/Text"
import source from "../tokens/figma-styles.json"
import "./foundations.css"

const meta = {
  title: "Foundations/Styles",
  parameters: { layout: "fullscreen", controls: { disable: true } },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Typography: Story = {
  play: async ({ canvasElement, globals }) => {
    await document.fonts.ready
    const rows = canvasElement.querySelectorAll(".foundations__type-row")
    await expect(rows).toHaveLength(source.textStyles.length)
    for (const [i, row] of [...rows].entries()) {
      const style = source.textStyles[i]
      const rendered = getComputedStyle(row.lastElementChild!)
      await expect(rendered.fontSize).toBe(`${style.fontSize}px`)
      await expect(rendered.lineHeight).toBe(`${style.lineHeight.value}px`)
      await expect(rendered.fontWeight).toBe(String(style.fontName.variationSettings.wght))
      await expect(rendered.fontFamily).toContain(globals.typography === "chinese" ? "PingFang UI SC" : "Geist Mono")
    }
    await expect(document.fonts.check('400 16px "Geist Mono"')).toBe(true)
  },
  render: () => (
    <main className="foundations">
      <Text as="h1" size="3xl" weight="semibold">Typography · 文本样式</Text>
      <Text as="p" size="sm">36 styles · 12 sizes × 3 weights. Switch English / Chinese and Light / Dark in the toolbar.</Text>
      {source.textStyles.map(s => {
        const [size, weight] = s.name.split("/").map(p => p.replace(/^(text-|font-)/, ""))
        return <section key={s.key} className="foundations__type-row">
          <Text as="p" size="xs">{s.name} · {s.fontSize}/{s.lineHeight.value} · {s.fontName.variationSettings.wght}</Text>
          <Text as="p" size={size as TextSize} weight={weight as TextWeight}>Cemu Design System 设计系统 Aa 0123</Text>
        </section>
      })}
    </main>
  ),
}

export const Effects: Story = {
  play: async ({ canvasElement }) => {
    const samples = canvasElement.querySelectorAll(".foundations__effect-sample")
    await expect(samples).toHaveLength(source.effectStyles.length)
    for (const sample of samples) {
      const style = getComputedStyle(sample)
      const effect = source.effectStyles.find(s => sample.classList.contains(s.name.split("/").at(-1)!))!
      if (effect.name.startsWith("Backdrop Blur/")) await expect(style.backdropFilter).not.toBe("none")
      else if (effect.name.startsWith("Blur/")) await expect(style.filter).not.toBe("none")
      else await expect(style.boxShadow).not.toBe("none")
    }
  },
  render: () => (
    <main className="foundations">
      <Text as="h1" size="3xl" weight="semibold">Effects · 效果样式</Text>
      <div className="foundations__cards">
        {source.effectStyles.map(s => {
          const name = s.name.split("/").at(-1)!
          const backdrop = name.startsWith("backdrop-blur-")
          return <section key={s.key} className="foundations__effect-card">
            <div className="foundations__effect-stage">
              {backdrop && <div className="foundations__backdrop-pattern" />}
              <div className={`foundations__effect-sample ${name}${backdrop ? " foundations__glass" : ""}`}><Text size="sm" weight="medium">Aa 设计</Text></div>
            </div>
            <Text as="p" size="xs">{s.name}</Text>
          </section>
        })}
      </div>
    </main>
  ),
}

export const Gradients: Story = {
  play: async ({ canvasElement }) => {
    const samples = canvasElement.querySelectorAll(".foundations__gradient")
    await expect(samples).toHaveLength(3)
    for (const sample of samples) await expect(getComputedStyle(sample).backgroundImage).toContain("radial-gradient")
  },
  render: () => (
    <main className="foundations">
      <Text as="h1" size="3xl" weight="semibold">Gradients · 渐变样式</Text>
      <div className="foundations__cards">
        {source.paintStyles.map(s => <section key={s.key}>
          <div className={`foundations__gradient ${s.name.split("/").at(-1)}`} />
          <Text as="p" size="sm">{s.name}</Text>
        </section>)}
      </div>
    </main>
  ),
}

export const Grids: Story = {
  play: async ({ canvasElement }) => {
    for (const name of ["desktop", "mobile"]) {
      const grid = canvasElement.querySelector(`.grid-${name}`)!
      const style = getComputedStyle(grid)
      await expect(style.display).toBe("grid")
      await expect(style.gap).toBe(name === "desktop" ? "24px" : "16px")
      await expect(grid.children).toHaveLength(name === "desktop" ? 12 : 2)
    }
  },
  render: () => (
    <main className="foundations">
      <Text as="h1" size="3xl" weight="semibold">Grids · 栅格样式</Text>
      <Text as="p" size="sm">Desktop: 12 × 88px + 11 × 24px = 1320px. Mobile: 2 × 164px + 16px = 344px. Containers shrink fluidly below these reference widths.</Text>
      {(["desktop", "mobile"] as const).map((name, i) => <section key={name}>
        <Text as="h2" size="base" weight="medium">{source.gridStyles[i].name}</Text>
        <div className={`grid-${name}`}>
          {Array.from({ length: source.gridStyles[i].layoutGrids[0].count }, (_, j) => <div key={j} className="foundations__grid-column"><Text size="xs">{j + 1}</Text></div>)}
        </div>
      </section>)}
    </main>
  ),
}
