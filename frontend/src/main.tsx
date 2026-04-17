import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // PHẢI CÓ DÒNG NÀY
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter> {/* Bọc App lại như thế này */}
            <App />
        </BrowserRouter>
    </StrictMode>,
)