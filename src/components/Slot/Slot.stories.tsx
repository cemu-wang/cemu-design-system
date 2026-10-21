
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Slot, slotTypes } from "./Slot"
import type { SlotSize, SlotType } from "./Slot"

const sizes: SlotSize[] = ["sm", "md", "lg"]

function DemoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" />
    </svg>
  )
}

function demoContent(type: SlotType): ReactNode {
  switch (type) {
    case "icon":
      return <DemoIcon />

    case "avatar":
      return (
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "#dbeafe",
            color: "#1d4ed8",
            font: "var(--text-xs-font-semibold)",
          }}
        >
          A
        </span>
      )

    case "flag":
      return "🇨🇳"

    case "thumbnail":
      return (
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: "100%",
            height: "100%",
            background: "#ede9fe",
            color: "#6d28d9",
            font: "var(--text-xs-font-regular)",
          }}
        >
          ▧
        </span>
      )

    case "badge":
      return (
        <span
          style={{
            padding: "2px 8px",
            border: "1px solid var(--color-border, #e5e7eb)",
            borderRadius: 9999,
            background: "var(--color-surface, #fff)",
            color: "var(--color-text, #101828)",
            font: "var(--text-xs-font-regular)",
            whiteSpace: "nowrap",
          }}
        >
          Badge ★
        </span>
      )

    case "text":
      return "Text"

    case "kbd":
      return "⌘"

    default:
      return null
  }
}

const meta = {
  title: "Components/Slot",
  component: Slot,
  tags: ["autodocs"],
  args: {
    type: "icon",
    size: "md",
  },
  argTypes: {
    type: {
      control: "select",
      options: [...slotTypes],
    },
    size: {
      control: "select",
      options: sizes,
    },
    text: {
      control: "text",
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof Slot>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Slot {...args}>
      {args.type === "text" || args.type === "kbd"
        ? undefined
        : demoContent(args.type ?? "icon")}
    </Slot>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px repeat(3, 120px)",
        alignItems: "center",
        gap: 16,
        padding: 24,
        width: "max-content",
        color: "var(--color-text, #101828)",
      }}
    >
      <strong>Type</strong>

      {sizes.map((size) => (
        <strong key={size}>{size.toUpperCase()}</strong>
      ))}

      {slotTypes.map((type) => (
        <div key={type} style={{ display: "contents" }}>
          <span>{type}</span>

          {sizes.map((size) => (
            <div
              key={`${type}-${size}`}
              style={{
                display: "flex",
                alignItems: "center",
                minHeight: 48,
              }}
            >
              <Slot type={type} size={size}>
                {demoContent(type)}
              </Slot>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}
