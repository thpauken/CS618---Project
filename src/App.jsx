// src/App.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { Recipes } from './pages/Recipes.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  { path: '/', element: <Recipes /> },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
