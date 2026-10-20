
import { useEffect, useState } from "react"
import { Button } from "./components/Button/Button"
import "./App.css"

// Figma 中定义的 7 种视觉样式
const variants = [
  "primary",
  "primaryOutline",
  "secondary",
  "soft",
  "outline",
  "ghost",
  "destructive",
] as const

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // 将颜色模式写入 HTML 根元素
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <main className="preview">
      <header className="preview__header">
        <div>
          <h1>Button</h1>
          <p>Cemu Design System · Component Playground</p>
        </div>

        {/* 颜色模式切换 */}
        <button
          type="button"
          className="theme-switch"
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      {/* 遍历所有按钮变体 */}
      {variants.map((variant) => (
        <section className="preview__section" key={variant}>
          <h2>{variant}</h2>

          <div className="preview__row">
            <Button variant={variant} size="sm">
              Small
            </Button>

            <Button variant={variant} size="md">
              Medium
            </Button>

            <Button variant={variant} size="lg">
              Large
            </Button>

            <Button variant={variant} disabled>
              Disabled
            </Button>

            <Button variant={variant} loading>
              Loading
            </Button>

            <Button
              variant={variant}
              size="md"
              startSlot={<span>+</span>}
            >
              Add item
            </Button>

            <Button
              variant={variant}
              size="md"
              iconOnly
              startSlot={<span>+</span>}
              aria-label="新增项目"
            />
          </div>
        </section>
      ))}
    </main>
  )
}

export default App
