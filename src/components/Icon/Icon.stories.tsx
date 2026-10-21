import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, waitFor, within } from "storybook/test"
import { Icon } from "./Icon"
import { iconNames } from "./icon-names"
import { Text } from "../Text/Text"
import { Button } from "../Button/Button"

const meta = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: { layout: "centered", docs: { description: { component: `Material Symbols Rounded · ${iconNames.length} 个图标。Fill 0 / Weight 400 / Grade 0 / Optical Size 24。本地 SVG 路径按需加载，继承父级颜色。` } } },
  args: { name: "search", size: 24, "aria-label": "搜索" },
  argTypes: { name: { control: "select", options: iconNames }, size: { control: "number" } },
} satisfies Meta<typeof Icon>
export default meta
type Story = StoryObj<typeof meta>

function IconGallery() {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<typeof iconNames[number]>("search")
  const matches = iconNames.filter(name => name.includes(query.trim().toLowerCase().replace(/\s+/g, "_")))
  const pages = Math.max(1, Math.ceil(matches.length / 60))
  return <div style={{ display: "grid", gap: "var(--spacing-24)" }}>
    <Text as="h2" size="lg" weight="medium">Material Symbols Rounded · {iconNames.length}</Text>
    <label style={{ display: "grid", gap: "var(--spacing-8)" }}>
      <Text size="sm">搜索图标（英文名称，如 mail、person、calendar）</Text>
      <input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(0) }} style={{ padding: "var(--spacing-12)", color: "var(--color-text)", background: "var(--color-surface)" }} />
    </label>
    <div style={{ display: "flex", gap: "var(--spacing-16)", alignItems: "center", flexWrap: "wrap" }}>
      <Icon name={selected} size={32} aria-label={`选中 ${selected}`} />
      <Text size="sm">{`<Icon name="${selected}" />`}</Text>
      <Button startSlot={<Icon name={selected} />}>按钮预览</Button>
    </div>
    <Text size="sm" aria-live="polite">找到 {matches.length} 个图标 · 第 {page + 1} / {pages} 页</Text>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "var(--spacing-16)" }}>
      {matches.slice(page * 60, (page + 1) * 60).map(name => <button type="button" key={name} aria-label={`选择 ${name}`} aria-pressed={selected === name} onClick={() => setSelected(name)} style={{ display: "grid", justifyItems: "center", gap: "var(--spacing-12)", padding: "var(--spacing-16)", color: "inherit", background: "transparent", border: "1px solid currentColor", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
        <Icon name={name} />
        <Text size="xs" style={{ overflowWrap: "anywhere" }}>{name}</Text>
      </button>)}
    </div>
    {matches.length === 0 && <Text size="sm">没有匹配的图标，请尝试其他英文关键词。</Text>}
    <div style={{ display: "flex", gap: "var(--spacing-12)" }}>
      <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>上一页</Button>
      <Button variant="outline" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>下一页</Button>
    </div>
  </div>
}

export const Playground: Story = {}
export const Gallery: Story = {
  parameters: { controls: { disable: true }, layout: "padded" },
  render: () => <IconGallery />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole("searchbox"), "mail")
    const choice = canvas.getByRole("button", { name: "选择 mail" })
    await userEvent.click(choice)
    const icon = canvas.getByRole("img", { name: "选中 mail" })
    await waitFor(() => expect(icon).toHaveAttribute("data-icon-status", "ready"))
    await expect(icon.querySelector("path")).toHaveAttribute("d")
    await expect(getComputedStyle(icon).fill).toBe(getComputedStyle(icon.parentElement!).color)
    await userEvent.clear(canvas.getByRole("searchbox"))
  },
}
