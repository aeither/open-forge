import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"

import App from "@/App.tsx"
import { WalletProvider } from "@/components/WalletProvider.tsx"
import { ApolloProvider } from "@apollo/client"
// Internal components
import { Toaster } from "./components/ui/sonner"
import { QueryProvider } from "./lib/providers"
import client from "./utils/apollo-client"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <QueryProvider>
        <ApolloProvider client={client}>
          <App />
          <Toaster richColors theme="light" position="bottom-right" />
        </ApolloProvider>
      </QueryProvider>
    </WalletProvider>
  </React.StrictMode>
)
