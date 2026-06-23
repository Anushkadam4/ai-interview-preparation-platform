import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './features/auth/auth.context'



import App from './App.jsx'
import "./style.scss"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
