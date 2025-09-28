import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Recipes } from './Recipes.jsx'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Recipes />
    </QueryClientProvider>
  )
}
