
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react"
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

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  variant?: ButtonVariant
  size?: ButtonSize
  iconOnly?: boolean
  startSlot?: ReactNode
  endSlot?: ReactNode
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
          <span className="button__slot" aria-hidden="true">
            {loading ? (
              <span className="button__spinner" />
            ) : (
              startSlot ?? endSlot
            )}
          </span>
        ) : (
          <>
            {(startSlot != null || loading) && (
              <span className="button__slot" aria-hidden="true">
                {loading ? (
                  <span className="button__spinner" />
                ) : startSlot}
              </span>
            )}

            <span className="button__label">{label}</span>

            {!loading && endSlot != null && (
              <span className="button__slot" aria-hidden="true">
                {endSlot}
              </span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
