import type { SVGProps } from "react"
import { iconPaths } from "./icon-data"

export type IconName = keyof typeof iconPaths
export type IconProps = Omit<SVGProps<SVGSVGElement>, "children" | "name"> & {
  name: IconName
  size?: number
}

/** Material Symbols Rounded: FILL 0, wght 400, GRAD 0, opsz 24. */
export function Icon({ name, size = 24, style, ...props }: IconProps) {
  const labelled = Boolean(props["aria-label"] || props["aria-labelledby"])
  return <svg width={size} height={size} viewBox="0 -960 960 960"
    fill="currentColor" aria-hidden={labelled ? undefined : true}
    role={labelled ? "img" : undefined} focusable="false"
    style={{ display: "inline-block", flexShrink: 0, verticalAlign: "middle", ...style }}
    {...props} data-icon={name}>
    {iconPaths[name].map((d, index) => <path key={index} d={d} />)}
  </svg>
}
