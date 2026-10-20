
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./Button"

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
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
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

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
  args: { loading: true },
}
