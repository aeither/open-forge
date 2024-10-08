import { Button } from "@/components/ui/button"
import { useKeylessAccount } from "@/context/KeylessAccountContext"
import { ABI } from "@/utils/abi-aptos_friend"
import { getAptosClient, getSurfClient } from "@/utils/aptosClient"
import { GET_COLLECTION_NFTS } from "@/utils/graphql-doc"
import { useApolloClient } from "@apollo/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createEntryPayload } from "@thalalabs/surf"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { toast } from "sonner"

type TradeShareArguments = {
  issuerObjectAddress: string
  isBuying: boolean
}

export const useTradeShare = () => {
  const { client: walletClient } = useWalletClient()
  const queryClient = useQueryClient()
  const apolloClient = useApolloClient()
  const { keylessAccount } = useKeylessAccount()

  return useMutation({
    mutationFn: async ({
      issuerObjectAddress,
      isBuying,
    }: TradeShareArguments) => {
      const functionName = isBuying ? "buy_share" : "sell_share"
      const payload = createEntryPayload(ABI, {
        function: functionName,
        functionArguments: [issuerObjectAddress as `0x${string}`, 1],
        typeArguments: [],
      })

      const toastId = toast.loading(
        `${isBuying ? "Buying" : "Selling"} 1 share...`
      )

      if (keylessAccount) {
        const result = await getSurfClient().submitTransaction({
          payload,
          signer: keylessAccount,
        })
        return { hash: result.hash, toastId }
      }

      if (!walletClient) throw new Error("Wallet client not available")
      const result = await walletClient.useABI(ABI)[functionName]({
        type_arguments: [],
        arguments: [issuerObjectAddress as `0x${string}`, 1],
      })

      return { hash: result.hash, toastId }
    },
    onSuccess: async ({ hash, toastId }) => {
      const executedTransaction = await getAptosClient().waitForTransaction({
        transactionHash: hash,
      })

      queryClient.invalidateQueries()
      await apolloClient.refetchQueries({
        include: [GET_COLLECTION_NFTS],
      })

      const explorerUrl = `https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${import.meta.env.VITE_APP_NETWORK}`

      toast.success("Trade successful", {
        id: toastId,
        description: (
          <div>
            <p>1 Share traded successfully!</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(explorerUrl, "_blank")}
              className="mt-2"
            >
              View on Explorer
            </Button>
          </div>
        ),
        duration: 5000,
      })

      console.log(`View transaction on explorer: ${explorerUrl}`)
    },
    onError: (error, variables, context) => {
      console.error(error)
      toast.error("Trade failed", {
        id: (context as { toastId: string })?.toastId,
        description: "Failed to trade share",
      })
    },
  })
}

type IssueShareArguments = {
  username: string
}

export const useIssueShare = () => {
  const { client: walletClient } = useWalletClient()
  const queryClient = useQueryClient()
  const apolloClient = useApolloClient()
  const { keylessAccount } = useKeylessAccount()

  return useMutation({
    mutationFn: async ({ username }: IssueShareArguments) => {
      const payload = createEntryPayload(ABI, {
        function: "issue_share",
        functionArguments: [username],
        typeArguments: [],
      })

      const toastId = toast.loading("Issuing share...")

      if (keylessAccount) {
        const result = await getSurfClient().submitTransaction({
          payload,
          signer: keylessAccount,
        })
        return { hash: result.hash, toastId }
      }

      if (!walletClient) throw new Error("Wallet client not available")
      const result = await walletClient.useABI(ABI).issue_share({
        type_arguments: [],
        arguments: [username],
      })

      return { hash: result.hash, toastId }
    },
    onSuccess: async ({ hash, toastId }) => {
      const executedTransaction = await getAptosClient().waitForTransaction({
        transactionHash: hash,
      })

      queryClient.invalidateQueries()
      await apolloClient.refetchQueries({
        include: [GET_COLLECTION_NFTS],
      })

      const explorerUrl = `https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${import.meta.env.VITE_APP_NETWORK}`

      toast.success("Share issued", {
        id: toastId,
        description: (
          <div>
            <p>Share issued successfully!</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(explorerUrl, "_blank")}
              className="mt-2"
            >
              View on Explorer
            </Button>
          </div>
        ),
        duration: 5000,
      })

      console.log(`View transaction on explorer: ${explorerUrl}`)
    },
    onError: (error, variables, context) => {
      console.error(error)
      toast.error("Issue failed", {
        id: (context as { toastId: string })?.toastId,
        description: "Failed to issue share",
      })
    },
  })
}
