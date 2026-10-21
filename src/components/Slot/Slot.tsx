import { isValidElement, type HTMLAttributes, type ReactElement } from "react"
import "./Slot.css"

// Extend this union only when the corresponding component is implemented.
export type SlotType = "icon"
export type SlotSize = "sm" | "md" | "lg"

export interface SlotProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  type?: SlotType
  size?: SlotSize
  /** An SVG/icon element. Plain text and boolean visibility flags are not slot content. */
  children?: ReactElement
}

/** Icon-only content slot. Figma: SM 16/16, MD 20/18, LG 24/20. */
export function Slot({ type = "icon", size = "sm", children, className = "", ...props }: SlotProps) {
  // Also reject unsupported types/content from JavaScript and stale saved args.
  if (type !== "icon" || (children != null && !isValidElement(children))) return null

  return (
    <span {...props} className={["slot", "slot--icon", `slot--${size}`, className].filter(Boolean).join(" ")}>
      <span className="slot__content">{children}</span>
    </span>
  )
}
