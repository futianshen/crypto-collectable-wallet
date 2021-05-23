import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import Router from "./Router"

const App: React.VFC = () => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Router />
    </QueryClientProvider>
  )
}

export default App
