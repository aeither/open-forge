import { Button } from "@/components/ui/button"
import { useKeylessAccount } from "@/context/KeylessAccountContext"
import { ABI } from "@/utils/abi-product_nft"
import { getAptosClient, getSurfClient } from "@/utils/aptosClient"
import { GET_COLLECTION_NFTS } from "@/utils/graphql-doc"
import { useApolloClient } from "@apollo/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createEntryPayload } from "@thalalabs/surf"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { toast } from "sonner"

export type MintProductNFTArguments = {
  name: string
  description: string
  uri: string
}

export type UpvoteProductArguments = {
  productName: string
}
export const useMintProductNFT = () => {
  const { client } = useWalletClient()
  const queryClient = useQueryClient()
  const apolloClient = useApolloClient()
  const { keylessAccount } = useKeylessAccount()

  return useMutation({
    mutationFn: async ({ name, description, uri }: MintProductNFTArguments) => {
      const payload = createEntryPayload(ABI, {
        function: "mint_product",
        functionArguments: [name, description, uri],
        typeArguments: [],
      })

      const toastId = toast.loading("Minting product NFT...")

      if (keylessAccount) {
        const result = await getSurfClient().submitTransaction({
          payload,
          signer: keylessAccount,
        })
        return { hash: result.hash, toastId }
      }

      if (!client) throw new Error("Wallet client not available")
      const result = await client.useABI(ABI).mint_product({
        arguments: [name, description, uri],
        type_arguments: [],
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

      const explorerUrl = `https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${process.env.VITE_APP_NETWORK}`

      toast.success("Mint successful", {
        id: toastId,
        description: (
          <div>
            <p>Mint transaction succeeded!</p>
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
      toast.error("Mint failed", {
        id: (context as { toastId: string })?.toastId,
        description: "Failed to mint product NFT",
      })
    },
  })
}

export const useUpvoteProduct = () => {
  const { client } = useWalletClient()
  const queryClient = useQueryClient()
  const apolloClient = useApolloClient()
  const { keylessAccount } = useKeylessAccount()

  return useMutation({
    mutationFn: async ({ productName }: UpvoteProductArguments) => {
      const payload = createEntryPayload(ABI, {
        function: "upvote_product",
        functionArguments: [productName],
        typeArguments: [],
      })

      const toastId = toast.loading("Upvoting product...")

      if (keylessAccount) {
        const result = await getSurfClient().submitTransaction({
          payload,
          signer: keylessAccount,
        })
        return { hash: result.hash, toastId }
      }

      if (!client) throw new Error("Wallet client not available")
      const result = await client.useABI(ABI).upvote_product({
        arguments: [productName],
        type_arguments: [],
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

      const explorerUrl = `https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${process.env.VITE_APP_NETWORK}`

      toast.success("Upvote successful", {
        id: toastId,
        description: (
          <div>
            <p>Upvote transaction succeeded!</p>
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
      toast.error("Upvote failed", {
        id: (context as { toastId: string })?.toastId,
        description: "Failed to upvote product",
      })
    },
  })
}
