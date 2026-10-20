import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "./styles/tokens.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// 全局样式
import "./index.css"

// 设计系统 Token
import "./styles/tokens.css"