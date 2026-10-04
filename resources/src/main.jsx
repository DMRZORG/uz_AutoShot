import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'
import './lib/process-capture'

if (import.meta.env.DEV && !window.GetParentResourceName) import('./dev/mock')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
