import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react"
import { Slot, type SlotType } from "../Slot/Slot"
import "./Button.css"

type ButtonVariant =
  | "primary"
  | "primaryOutline"
  | "secondary"
  | "soft"
  | "outline"
  | "ghost"
  | "destructive"

type ButtonSize = "sm" | "md" | "lg"
type ButtonSlotType = Exclude<SlotType, "checkbox" | "radio" | "switch">

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  variant?: ButtonVariant
  size?: ButtonSize
  iconOnly?: boolean
  startSlot?: ReactNode
  endSlot?: ReactNode
  startSlotType?: ButtonSlotType
  endSlotType?: ButtonSlotType
  loading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      children,
      variant = "primary",
      size = "md",
      iconOnly = false,
      startSlot,
      endSlot,
      startSlotType = "icon",
      endSlotType = "icon",
      loading = false,
      fullWidth = false,
      disabled,
      type = "button",
      className = "",
      ...props
    },
    ref
  ) => {
    const label = children ?? text
    const spinner = <span className="button__spinner" />

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={[
          "button",
          `button--${variant}`,
          `button--${size}`,
          iconOnly && "button--icon-only",
          fullWidth && "button--full",
          className,
        ].filter(Boolean).join(" ")}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        {iconOnly ? (
          <Slot
            type={loading ? "icon" : startSlot != null ? startSlotType : endSlotType}
            size={size}
            aria-hidden="true"
          >
            {loading ? spinner : startSlot ?? endSlot}
          </Slot>
        ) : (
          <>
            {(startSlot != null || loading) && (
              <Slot
                type={loading ? "icon" : startSlotType}
                size={size}
                aria-hidden="true"
              >
                {loading ? spinner : startSlot}
              </Slot>
            )}

            <span className="button__label">{label}</span>

            {!loading && endSlot != null && (
              <Slot type={endSlotType} size={size} aria-hidden="true">
                {endSlot}
              </Slot>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
