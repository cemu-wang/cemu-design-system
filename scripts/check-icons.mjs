import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import ts from "typescript"

const folder = "public/icons/material-symbols-rounded"
const manifest = JSON.parse(await fs.readFile(`${folder}/manifest.json`, "utf8"))
const files = (await fs.readdir(folder)).filter(name => name !== "manifest.json")
assert.equal(files.length, manifest.count)
for (const file of files) {
  assert.match(file, /^[a-z0-9_]+\.json$/)
  const paths = JSON.parse(await fs.readFile(`${folder}/${file}`, "utf8"))
  assert.ok(paths.length && paths.every(d => typeof d === "string" && d.startsWith("M") && !/NaN|Infinity/.test(d)), file)
}
const cache = path.resolve("node_modules/.cache/icons-check")
await fs.mkdir(cache, { recursive: true })
for (const name of ["icon-data", "load-icon"]) {
  const source = await fs.readFile(`src/components/Icon/${name}.ts`, "utf8")
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    .replace('"./icon-data"', '"./icon-data.mjs"').replace("import.meta.env.BASE_URL", '"/subpath/"')
  await fs.writeFile(`${cache}/${name}.mjs`, output)
}
let requests = 0
let fail = false
globalThis.fetch = async url => {
  requests++
  assert.match(url, /^\/subpath\/icons\/material-symbols-rounded\/[a-z0-9_]+\.json$/)
  const name = url.split("/").at(-1)
  return { ok: !fail, status: fail ? 503 : 200, json: async () => JSON.parse(await fs.readFile(`${folder}/${name}`, "utf8")) }
}
const { loadIcon } = await import(`${cache}/load-icon.mjs`)
await loadIcon("add")
assert.equal(requests, 0, "Common icons must stay synchronous")
const a = loadIcon("mail")
assert.equal(a, loadIcon("mail"), "Concurrent requests must share a promise")
await a
await loadIcon("mail")
assert.equal(requests, 1, "Loaded icons must be cached")
fail = true
await assert.rejects(loadIcon("person"), /503/)
fail = false
await loadIcon("person")
assert.equal(requests, 3, "Failed requests must be retryable")
console.log(`PASS: ${files.length} local SVG path assets, lazy loading, cache, request deduplication, base paths, and failed-request retry.`)
