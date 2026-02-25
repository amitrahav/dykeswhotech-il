import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PostHogProvider } from 'posthog-js/react'
import './index.css'
import App from './App.tsx'

const posthogOptions = {
  api_host: 'https://us.i.posthog.com',
  capture_pageview: false,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_KEY}
      options={posthogOptions}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PostHogProvider>
  </StrictMode>,
)
