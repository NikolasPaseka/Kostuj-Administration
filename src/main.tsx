import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HeroUIProvider } from "@heroui/react"
import './translations/i18n'

// Import extension files
import './extensions/string.extension';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <HeroUIProvider>
      <main className={`${localStorage.getItem("theme") || "light" } text-foreground bg-background`}>
        <App />
      </main>
    </HeroUIProvider>
  // </React.StrictMode>
)
