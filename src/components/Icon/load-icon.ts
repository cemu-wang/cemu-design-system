import { iconPaths } from "./icon-data"
import type { IconName } from "./icon-names"

// Keep frequently used icons synchronous; fetch other local paths only on use.
const cache = new Map<string, readonly string[]>(Object.entries(iconPaths))
const pending = new Map<string, Promise<readonly string[]>>()
export function cachedIcon(name: IconName) { return cache.get(name) }
export function loadIcon(name: IconName): Promise<readonly string[]> {
  const cached = cache.get(name)
  if (cached) return Promise.resolve(cached)
  const existing = pending.get(name)
  if (existing) return existing
  const request = fetch(`${import.meta.env.BASE_URL}icons/material-symbols-rounded/${encodeURIComponent(name)}.json`)
    .then(async response => {
      if (!response.ok) throw new Error(`Icon ${name}: HTTP ${response.status}`)
      const paths: unknown = await response.json()
      if (!Array.isArray(paths) || !paths.length || !paths.every(p => typeof p === "string" && p.length > 0)) {
        throw new Error(`Invalid icon paths: ${name}`)
      }
      cache.set(name, paths)
      return paths as string[]
    }).finally(() => { pending.delete(name) })
  pending.set(name, request)
  return request
}
