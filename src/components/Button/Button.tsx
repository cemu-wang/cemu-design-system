import {
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react"
import { Slot, type SlotType } from "../Slot/Slot"
import { Text } from "../Text/Text"
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
type ButtonSlotType = SlotType

// Figma text style bindings: SM → xs/medium, MD → sm/medium, LG → base/medium.
const labelSizes = { sm: "xs", md: "sm", lg: "base" } as const

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
    const startIcon = isValidElement(startSlot) ? startSlot : undefined
    const endIcon = isValidElement(endSlot) ? endSlot : undefined
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
            type={loading ? "icon" : startIcon != null ? startSlotType : endSlotType}
            size={size}
            aria-hidden="true"
          >
            {loading ? spinner : startIcon ?? endIcon}
          </Slot>
        ) : (
          <>
            {(startIcon != null || loading) && (
              <Slot
                type={loading ? "icon" : startSlotType}
                size={size}
                aria-hidden="true"
              >
                {loading ? spinner : startIcon}
              </Slot>
            )}

            <Text size={labelSizes[size]} weight="medium" className="button__label">{label}</Text>

            {!loading && endIcon != null && (
              <Slot type={endSlotType} size={size} aria-hidden="true">
                {endIcon}
              </Slot>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
