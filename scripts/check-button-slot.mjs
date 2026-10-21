import fs from "node:fs/promises"
import path from "node:path"
import assert from "node:assert/strict"
import ts from "typescript"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

const root = process.cwd()
const cache = path.join(root, "node_modules/.cache/button-slot-check")
await fs.mkdir(cache, { recursive: true })
for (const name of ["Slot", "Text", "Button"]) {
  const source = await fs.readFile(`src/components/${name}/${name}.tsx`, "utf8")
  const code = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
  }).outputText.replace(/import "\.\/[^"\n]+\.css";?/g, "")
    .replace('"../Slot/Slot"', '"./Slot.mjs"').replace('"../Text/Text"', '"./Text.mjs"')
  await fs.writeFile(path.join(cache, `${name}.mjs`), code)
}
const fixture = path.join(cache, "contracts.tsx")
await fs.writeFile(fixture, `
import type { SlotProps } from ${JSON.stringify(path.join(root, "src/components/Slot/Slot.tsx"))}
import type { ButtonProps } from ${JSON.stringify(path.join(root, "src/components/Button/Button.tsx"))}
export const icon: SlotProps = { type: "icon", children: <svg /> }
// @ts-expect-error Unimplemented Slot types must not be public API.
export const unsupported: SlotProps = { type: "avatar" }
// @ts-expect-error Text is not icon slot content.
export const text: SlotProps = { children: "hello" }
// @ts-expect-error Visibility flags are not icon slot content.
export const bool: SlotProps = { children: true }
// @ts-expect-error Button must not expose unimplemented Slot types.
export const buttonType: ButtonProps = { endSlotType: "kbd" }
// Button's existing ReactNode API remains compatible; it filters non-elements.
export const compatible: ButtonProps = { startSlot: false }
`)
const config = ts.readConfigFile("tsconfig.app.json", ts.sys.readFile)
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
const program = ts.createProgram([fixture], { ...options, incremental: false })
const diagnostics = ts.getPreEmitDiagnostics(program)
assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
  getCurrentDirectory: () => root, getCanonicalFileName: f => f, getNewLine: () => "\n",
}))
const { Slot } = await import(path.join(cache, "Slot.mjs"))
const { Button } = await import(path.join(cache, "Button.mjs"))
const icon = createElement("svg", { viewBox: "0 0 24 24", "data-icon": "supplied" })
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props))
let cases = 0
for (const [size, textSize] of [["sm", "xs"], ["md", "sm"], ["lg", "base"]]) {
  for (const variant of ["primary", "primaryOutline", "secondary", "soft", "outline", "ghost", "destructive"]) {
    const base = { size, variant, children: "Button" }
    const plain = render(Button, base)
    assert.match(plain, new RegExp(`text-${textSize}-font-medium button__label`))
    assert.doesNotMatch(plain, /class="slot /)
    const both = render(Button, { ...base, startSlot: icon, endSlot: icon })
    assert.equal((both.match(/<svg/g) ?? []).length, 2)
    for (const side of ["startSlot", "endSlot"]) {
      const only = render(Button, { ...base, [side]: icon, iconOnly: true, "aria-label": "Add" })
      assert.match(only, /data-icon="supplied"/)
      assert.match(only, new RegExp(`slot--icon slot--${size}`))
      assert.doesNotMatch(only, /button__label/)
      assert.match(only, /aria-label="Add"/)
      cases++
    }
    const ignored = render(Button, { ...base, startSlot: false, endSlot: true })
    assert.doesNotMatch(ignored, /class="slot /)
    const strings = render(Button, { ...base, startSlot: "icon", endSlot: "kbd" })
    assert.doesNotMatch(strings, /class="slot /)
    const loading = render(Button, { ...base, startSlot: icon, endSlot: icon, loading: true })
    assert.match(loading, /aria-busy="true"/)
    assert.match(loading, /disabled=""/)
    assert.match(loading, /button__spinner/)
    assert.doesNotMatch(loading, /<svg/)
    cases += 5
  }
}
for (const type of ["avatar", "flag", "thumbnail", "badge", "checkbox", "radio", "switch", "text", "kbd"]) {
  assert.equal(render(Slot, { type, children: icon }), "")
  cases++
}
assert.equal(render(Slot, { children: "Text" }), "")
assert.equal(render(Slot, { children: true }), "")
console.log(`PASS: public type contracts and ${cases + 2} server-rendered Button/Slot cases.`)
