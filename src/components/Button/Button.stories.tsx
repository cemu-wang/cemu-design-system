import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, within } from "storybook/test"
import { Button, type ButtonProps } from "./Button"
import { Text } from "../Text/Text"

import { Icon, type IconName } from "../Icon/Icon"
import { iconNames } from "../Icon/icon-names"

// Visibility controls belong to Storybook; Button receives renderable nodes.
type ButtonStoryArgs = ButtonProps & {
  showStartIcon?: boolean
  showEndIcon?: boolean
  startIconName?: IconName
  endIconName?: IconName
}

function renderButton({ showStartIcon, showEndIcon, startIconName = "add", endIconName = "arrow_forward", ...args }: ButtonStoryArgs) {
  const startSlot = showStartIcon ? <Icon name={startIconName} /> : undefined
  const endSlot = showEndIcon ? <Icon name={endIconName} /> : undefined

  return (
    <Button
      {...args}
      startSlot={startSlot ?? (args.iconOnly && endSlot == null ? <Icon name={startIconName} /> : undefined)}
      endSlot={endSlot}
      aria-label={args["aria-label"] ?? (args.iconOnly ? "新增项目" : undefined)}
    />
  )
}

const variants = ["primary", "primaryOutline", "secondary", "soft", "outline", "ghost", "destructive"] as const
const sizes = ["sm", "md", "lg"] as const

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  render: renderButton,
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    showStartIcon: false,
    showEndIcon: false,
    startIconName: "add",
    endIconName: "arrow_forward",
    iconOnly: false,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "primaryOutline",
        "secondary",
        "soft",
        "outline",
        "ghost",
        "destructive",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    children: { control: "text" },
    showStartIcon: { name: "显示前置图标", control: "boolean" },
    showEndIcon: { name: "显示后置图标", control: "boolean" },
    startIconName: { name: "前置图标", control: "select", options: iconNames },
    endIconName: { name: "后置图标", control: "select", options: iconNames },
    iconOnly: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    startSlot: { control: false, table: { category: "Slot content" } },
    endSlot: { control: false, table: { category: "Slot content" } },
    startSlotType: { control: false },
    endSlotType: { control: false },
  },
} satisfies Meta<ButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: "Playground · 直接预览",
  args: { showStartIcon: true, children: "Add item" },
}

export const Primary: Story = {}

export const PrimaryOutline: Story = {
  args: { variant: "primaryOutline" },
}

export const Secondary: Story = {
  args: { variant: "secondary" },
}

export const Soft: Story = {
  args: { variant: "soft" },
}

export const Outline: Story = {
  args: { variant: "outline" },
}

export const Ghost: Story = {
  args: { variant: "ghost" },
}

export const Destructive: Story = {
  args: { variant: "destructive" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Loading: Story = {
  args: { loading: true, showStartIcon: true, showEndIcon: true },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Button" })
    await expect(button).toBeDisabled()
    await expect(button).toHaveAttribute("aria-busy", "true")
    await expect(button.querySelector(".button__spinner")).toBeInTheDocument()
    await expect(button.querySelector("svg")).not.toBeInTheDocument()
  },
}

export const StartIcon: Story = {
  args: { showStartIcon: true, children: "Add item" },
  play: async ({ canvasElement, args, userEvent }) => {
    const button = within(canvasElement).getByRole("button", { name: "Add item" })
    await expect(button.querySelector(".slot--icon svg[data-icon='add']")).toBeInTheDocument()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const EndIcon: Story = {
  args: { showEndIcon: true, children: "Continue" },
}

export const BothIcons: Story = {
  args: { showStartIcon: true, showEndIcon: true },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Button" })
    await expect(button.querySelectorAll(".slot--icon svg")).toHaveLength(2)
  },
}

export const IconOnly: Story = {
  // Supply the actual SVG to the component, independent of visibility controls.
  args: { iconOnly: true, showStartIcon: true, "aria-label": "新增项目" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "新增项目" })
    await expect(button.querySelector(".slot--icon svg[data-icon='add']")).toBeInTheDocument()
    await expect(button.querySelector(".button__label")).not.toBeInTheDocument()
  },
}

export const IconOnlyEndSlot: Story = {
  args: { iconOnly: true, showEndIcon: true, "aria-label": "下一步" },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "下一步" })
    await expect(button.querySelector("svg[data-icon='arrow_forward']")).toBeInTheDocument()
  },
}

export const IconOnlyLoading: Story = {
  args: { iconOnly: true, showStartIcon: true, loading: true, "aria-label": "正在新增" },
}

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole("button")
    const textSizes = ["xs", "sm", "base"]
    const heights = [32, 40, 48]
    const fontSizes = [12, 14, 16]
    const lineHeights = [16, 20, 24]
    const iconSizes = [16, 18, 20]
    for (const [i, size] of sizes.entries()) {
      const label = buttons[i].querySelector(".button__label")!
      await expect(label).toHaveClass(`text-${textSizes[i]}-font-medium`)
      await expect(getComputedStyle(label).fontSize).toBe(`${fontSizes[i]}px`)
      await expect(getComputedStyle(label).lineHeight).toBe(`${lineHeights[i]}px`)
      await expect(getComputedStyle(label).fontWeight).toBe("500")
      for (const button of [buttons[i], buttons[i + 3]]) {
        await expect(getComputedStyle(button).height).toBe(`${heights[i]}px`)
        await expect(button.querySelector(".slot")).toHaveClass("slot--icon", `slot--${size}`)
        await expect(getComputedStyle(button.querySelector("svg")!).width).toBe(`${iconSizes[i]}px`)
      }
    }
  },
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      {sizes.map(size => (
        <Button key={size} size={size} startSlot={<Icon name="add" />} endSlot={<Icon name="arrow_forward" />}>{size.toUpperCase()}</Button>
      ))}
      {sizes.map(size => (
        <Button key={`icon-${size}`} size={size} iconOnly startSlot={<Icon name="add" />} aria-label={`新增项目 ${size}`} />
      ))}
    </div>
  ),
}

export const AllVariants: Story = {
  name: "All Variants · 全部样式",
  parameters: { controls: { disable: true }, layout: "padded" },
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      {variants.map(variant => (
        <section key={variant}>
          <Text as="h3" size="sm" weight="medium" style={{ color: "var(--color-text)", margin: "0 0 12px" }}>{variant}</Text>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Button variant={variant}>Button</Button>
            {sizes.map(size => (
              <Button key={size} variant={variant} size={size} startSlot={<Icon name="add" />} endSlot={<Icon name="arrow_forward" />}>Add item</Button>
            ))}
            <Button variant={variant} iconOnly startSlot={<Icon name="add" />} aria-label={`新增项目 ${variant}`} />
            <Button variant={variant} startSlot={<Icon name="add" />} disabled>Disabled</Button>
            <Button variant={variant} loading>Loading</Button>
          </div>
        </section>
      ))}
    </div>
  ),
}
