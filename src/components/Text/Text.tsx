import type { HTMLAttributes } from "react"

export type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl"
export type TextWeight = "regular" | "medium" | "semibold"
export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: TextSize
  weight?: TextWeight
}

/** Maps directly to the file's text-{size}/font-{weight} Figma styles. */
export function Text({ as: Tag = "span", size = "base", weight = "regular", className = "", ...props }: TextProps) {
  return <Tag {...props} className={[`text-${size}-font-${weight}`, className].filter(Boolean).join(" ")} />
}
