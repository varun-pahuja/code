import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { prefetch } from './api'

// Warm the first screen's data while the JS bundle is still downloading, so
// the first paint already has content instead of a skeleton. The api layer
// serves these from its short-lived cache, so nothing is fetched twice.
const ROUTE_DATA: Record<string, string[]> = {
  '/dashboard': ['/content', '/analytics/summary', '/analytics/trend?days=30'],
  '/review': ['/content'],
  '/kb': ['/kb/guidelines', '/kb/documents'],
}

function warmRoute(): void {
  const hash = location.hash.replace(/^#/, '') || '/'
  const detail = hash.match(/^\/review\/(\d+)/)
  if (detail) {
    ;[`/content/${detail[1]}`, `/content/${detail[1]}/comments`,
      `/content/${detail[1]}/versions`].forEach(prefetch)
    return
  }
  const key = Object.keys(ROUTE_DATA).find((k) => hash === k || hash.startsWith(k + '/'))
  if (key) ROUTE_DATA[key].forEach(prefetch)
}

warmRoute()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
