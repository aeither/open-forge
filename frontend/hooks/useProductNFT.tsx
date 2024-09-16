import { COLLECTION_NAME } from "@/lib/constants"
import { ABI } from "@/utils/abi-product_nft"

import { aptosClient } from "@/utils/aptosClient"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { toast } from "sonner"

export type MintProductNFTArguments = {
  name: string
  description: string
  uri: string
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
      toast("Success", {
        description: `Mint transaction succeeded, hash: ${executedTransaction.hash}`,
      })

      console.log(
        `View transaction on explorer: https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${process.env.VITE_APP_NETWORK}`
      )
    },
    onError: (error) => {
      console.error(error)
      toast("Error", {
        description: "Failed to mint product NFT",
      })
    },
  })
}

export const getCollectionName = async () => {
  //   const [collectionName] =
  //     await surfClientProductNFT().view.get_collection_name({
  //       functionArguments: [user.accountAddress as unknown as `0x${string}`],
  //       typeArguments: [],
  //     })

  return COLLECTION_NAME
}
