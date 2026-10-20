
import { Button } from "./components/Button/Button"

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
  return (
    <main style={{ padding: 40 }}>

      {variants.map((variant) => (
        <div
          key={variant}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Button variant={variant} size="sm">
            {variant}
          </Button>

          <Button variant={variant} size="md">
            {variant}
          </Button>

          <Button variant={variant} size="lg">
            {variant}
          </Button>

          <Button variant={variant} disabled>
            Disabled
          </Button>
        </div>
      ))}

      <Button
        iconOnly
        variant="primary"
        size="md"
        startSlot={<span>+</span>}
        aria-label="新增"
      />
    </main>
  )
}

export default App
