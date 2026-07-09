import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContentfulProvider } from './context/ContentfulProvider'
import './index.css'
import './i18n'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ContentfulProvider>
        <App />
      </ContentfulProvider>
    </QueryClientProvider>
  </StrictMode>,
)
