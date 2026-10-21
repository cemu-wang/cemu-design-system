/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite'
import "../src/styles/index.css"

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: { icon: "circlehollow", items: ["light", "dark"], dynamicTitle: true },
    },
    typography: {
      description: "Typography variable mode",
      toolbar: { icon: "globe", items: ["english", "chinese"], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "light", typography: "english" },
  decorators: [(Story, context) => {
    const theme = context.globals.theme === "dark" ? "dark" : "light"
    const typography = context.globals.typography === "chinese" ? "chinese" : "english"
    return <div className="ds-scope" data-theme={theme} data-typography={typography} lang={typography === "chinese" ? "zh-CN" : "en"} style={{ padding: "var(--spacing-16)" }}><Story /></div>
  }],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
