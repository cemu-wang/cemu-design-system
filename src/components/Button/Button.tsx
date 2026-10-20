
import "./Button.css"

type ButtonProps = {
  text: string
  variant?: "primary" | "secondary" | "ghost"
  onClick?: () => void
}

export function Button({
  text,
  variant = "primary",
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`button button--${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
