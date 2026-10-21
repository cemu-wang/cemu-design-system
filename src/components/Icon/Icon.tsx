import { useEffect, useState, type SVGProps } from "react"
import type { IconName } from "./icon-names"
import { cachedIcon, loadIcon } from "./load-icon"

export type { IconName } from "./icon-names"
export type IconProps = Omit<SVGProps<SVGSVGElement>, "children" | "name"> & {
  name: IconName
  size?: number
}

/** Material Symbols Rounded: FILL 0, wght 400, GRAD 0, opsz 24. */
export function Icon({ name, size = 24, style, ...props }: IconProps) {
  const [loaded, setLoaded] = useState<{ name: IconName; paths?: readonly string[]; error?: boolean }>(() => ({ name, paths: cachedIcon(name) }))
  const paths = cachedIcon(name) ?? (loaded.name === name ? loaded.paths : undefined)
  useEffect(() => {
    if (cachedIcon(name)) return
    let active = true
    loadIcon(name).then(paths => { if (active) setLoaded({ name, paths }) })
      .catch(() => { if (active) setLoaded({ name, error: true }) })
    return () => { active = false }
  }, [name])
  const labelled = Boolean(props["aria-label"] || props["aria-labelledby"])
  return <svg width={size} height={size} viewBox="0 -960 960 960"
    fill="currentColor" aria-hidden={labelled ? undefined : true}
    role={labelled ? "img" : undefined} focusable="false"
    style={{ display: "inline-block", flexShrink: 0, verticalAlign: "middle", ...style }}
    {...props} data-icon={name} data-icon-status={paths ? "ready" : loaded.name === name && loaded.error ? "error" : "loading"}>
    {paths?.map((d, index) => <path key={index} d={d} />)}
  </svg>
}
