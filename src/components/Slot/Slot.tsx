
import type { HTMLAttributes, ReactNode } from "react"
import "./Slot.css"

export const slotTypes = [
  "icon",
  "avatar",
  "flag",
  "thumbnail",
  "badge",
  "checkbox",
  "radio",
  "switch",
  "text",
  "kbd",
] as const

export type SlotType = (typeof slotTypes)[number]
export type SlotSize = "sm" | "md" | "lg"

export interface SlotProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  type?: SlotType
  size?: SlotSize
  text?: string
  children?: ReactNode
}

export function Slot({
  type = "icon",
  size = "sm",
  text,
  children,
  className = "",
  ...props
}: SlotProps) {
  const content =
    children ??
    (type === "text"
      ? (text ?? "Text")
      : type === "kbd"
        ? (text ?? "⌘")
        : null)

  let inner: ReactNode

  if (type === "kbd") {
    inner = <kbd className="slot__kbd">{content}</kbd>
  } else if (content != null) {
    inner = <span className="slot__content">{content}</span>
  } else if (type === "checkbox") {
    inner = <span className="slot__checkbox" aria-hidden="true" />
  } else if (type === "radio") {
    inner = <span className="slot__radio" aria-hidden="true" />
  } else if (type === "switch") {
    inner = <span className="slot__switch" aria-hidden="true" />
  } else {
    inner = <span className="slot__content" />
  }

  return (
    <span
      {...props}
      className={[
        "slot",
        `slot--${type}`,
        `slot--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {inner}
    </span>
  )
}
