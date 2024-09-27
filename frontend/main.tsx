import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"

import App from "@/App.tsx"
import { WalletProvider } from "@/components/WalletProvider.tsx"
import { ApolloProvider } from "@apollo/client"
import { SDKProvider } from "@telegram-apps/sdk-react"
// Internal components
import { Toaster } from "./components/ui/sonner"
import { KeylessAccountProvider } from "./context/KeylessAccountContext"
import { QueryProvider } from "./lib/providers"
import client from "./utils/apollo-client"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SDKProvider acceptCustomStyles debug>
      <WalletProvider>
        <QueryProvider>
          <ApolloProvider client={client}>
            <KeylessAccountProvider>
              <App />
            </KeylessAccountProvider>
            <Toaster richColors theme="light" position="top-right" />
          </ApolloProvider>
        </QueryProvider>
      </WalletProvider>
    </SDKProvider>
  </React.StrictMode>
)
