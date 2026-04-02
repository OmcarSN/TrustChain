import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Buffer } from 'buffer'
import './index.css'
import App from './App.jsx'
import { WalletProvider } from './context/WalletContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'

if (typeof window !== 'undefined') {
  window.Buffer = Buffer
  window.global = window
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <WalletProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WalletProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)
