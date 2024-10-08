import { NETWORK } from "@/lib/constants"
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import type { PropsWithChildren } from "react"
import { toast } from "sonner"

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: NETWORK,
        mizuwallet: {
          // Learn more https://docs.mizu.io/docs/preparation/mizu-app-id
          appId: undefined,
          // Learn more https://docs.mizu.io/docs/preparation/manifest-json
          manifestURL:
            "https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json",
        },
      }}
      // optInWallets={["Mizu Wallet"]}
      onError={(error) => {
        toast.error("Error", {
          description: error || "Unknown wallet error",
        })
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  )
}
