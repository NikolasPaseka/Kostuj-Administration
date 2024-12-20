import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import './translations/i18n'

// Import extension files
import './extensions/string.extension';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className={`${localStorage.getItem("theme") || "light" } text-foreground bg-background`}>
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>
)
