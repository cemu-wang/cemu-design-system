import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { Slot } from "./Slot"
import type { SlotSize } from "./Slot"
import { Text } from "../Text/Text"

const sizes: SlotSize[] = ["sm", "md", "lg"]
const dimensions = { sm: [16, 16], md: [20, 18], lg: [24, 20] } as const

import { Icon } from "../Icon/Icon"

const meta = {
  title: "Components/Slot",
  component: Slot,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: "当前仅实现 Icon。图标尺寸按 Figma 对齐，颜色和文本样式继承父组件；其他类型待对应组件完成后扩展。" } },
  },
  args: { type: "icon", size: "md" },
  argTypes: {
    type: { control: false, table: { type: { summary: '"icon"' } } },
    size: { control: "select", options: sizes },
    children: { control: false },
  },
  render: args => <Slot {...args} role="img" aria-label="搜索"><Icon name="search" /></Slot>,
} satisfies Meta<typeof Slot>
export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Small: Story = { args: { size: "sm" } }
export const Medium: Story = { args: { size: "md" } }
export const Large: Story = { args: { size: "lg" } }

export const AllVariants: Story = {
  name: "Icon · 三种尺寸",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--spacing-16)" }}>
      {sizes.map(size => <div key={size} style={{ display: "grid", justifyItems: "center", gap: "var(--spacing-12)" }}>
        <Text size="xs" weight="medium">{size.toUpperCase()}</Text>
        <Slot size={size} role="img" aria-label={`搜索 ${size}`}><Icon name="search" /></Slot>
        <Text size="xs">{dimensions[size][0]} / {dimensions[size][1]} px</Text>
      </div>)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const size of sizes) {
      const slot = within(canvasElement).getByRole("img", { name: `搜索 ${size}` })
      const icon = slot.querySelector("svg")!
      await expect(slot).toHaveClass("slot--icon", `slot--${size}`)
      await expect(getComputedStyle(slot).width).toBe(`${dimensions[size][0]}px`)
      await expect(getComputedStyle(slot).height).toBe(`${dimensions[size][0]}px`)
      await expect(getComputedStyle(icon).width).toBe(`${dimensions[size][1]}px`)
      await expect(getComputedStyle(icon).height).toBe(`${dimensions[size][1]}px`)
    }
  },
}
