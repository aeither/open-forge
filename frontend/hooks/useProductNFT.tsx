import { Button } from "@/components/ui/button"
import { ABI } from "@/utils/abi-product_nft"
import { aptosClient, surfClientProductNFT } from "@/utils/aptosClient"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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

  return useMutation({
    mutationFn: async ({ name, description, uri }: MintProductNFTArguments) => {
      if (!client) throw new Error("Wallet client not available")
      const result = await client.useABI(ABI).mint_product({
        arguments: [name, description, uri],
        type_arguments: [],
      })
      return result.hash
    },
    onSuccess: async (hash) => {
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: hash,
      })

      queryClient.invalidateQueries()

      const explorerUrl = `https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${process.env.VITE_APP_NETWORK}`

      toast("Success", {
        description: (
          <div>
            <p>Mint transaction succeeded, hash: {executedTransaction.hash}</p>
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
    onError: (error) => {
      console.error(error)
      toast("Error", {
        description: "Failed to mint product NFT",
      })
    },
  })
}

export const useUpvoteProduct = () => {
  const { client } = useWalletClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productName }: UpvoteProductArguments) => {
      if (!client) throw new Error("Wallet client not available")

      const productObject = await surfClientProductNFT().view.get_product_obj({
        functionArguments: [productName],
        typeArguments: [],
      })

      // Now upvote the product
      const result = await client.useABI(ABI).upvote_product({
        arguments: [productObject[0].inner],
        type_arguments: [],
      })

      return result.hash
    },
    onSuccess: async (hash) => {
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: hash,
      })

      queryClient.invalidateQueries()

      const explorerUrl = `https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${process.env.VITE_APP_NETWORK}`

      toast("Success", {
        description: (
          <div>
            <p>
              Upvote transaction succeeded, hash: {executedTransaction.hash}
            </p>
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
    onError: (error) => {
      console.error(error)
      toast("Error", {
        description: "Failed to upvote product",
      })
    },
  })
}
