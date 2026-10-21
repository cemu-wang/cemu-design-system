import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { Icon, type IconName } from "./Icon"
import { iconPaths } from "./icon-data"
import { Text } from "../Text/Text"

const names = Object.keys(iconPaths) as IconName[]
const meta = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: { layout: "centered", docs: { description: { component: "Material Symbols Rounded · Fill 0 / Weight 400 / Grade 0 / Optical Size 24。本地 SVG，继承父级颜色；Slot 内显示尺寸由 Slot 管理。" } } },
  args: { name: "search", size: 24, "aria-label": "搜索" },
  argTypes: { name: { control: "select", options: names }, size: { control: "number" } },
} satisfies Meta<typeof Icon>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Gallery: Story = {
  parameters: { controls: { disable: true }, layout: "padded" },
  render: () => <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "var(--spacing-24)" }}>
    {names.map(name => <div key={name} style={{ display: "grid", justifyItems: "center", gap: "var(--spacing-12)", padding: "var(--spacing-16)" }}>
      <Icon name={name} aria-label={name} />
      <Text size="xs">{name}</Text>
    </div>)}
  </div>,
  play: async ({ canvasElement }) => {
    for (const name of names) {
      const icon = within(canvasElement).getByRole("img", { name })
      await expect(icon.querySelector("path")).toHaveAttribute("d", iconPaths[name][0])
      await expect(getComputedStyle(icon).width).toBe("24px")
      await expect(getComputedStyle(icon).fill).toBe(getComputedStyle(icon.parentElement!).color)
    }
  },
}
