// hooks/useRandomProduct.ts

import { Button } from "@/components/ui/button"
import { useKeylessAccount } from "@/context/KeylessAccountContext"
import { COLLECTION_NAME } from "@/lib/constants"
import { ABI } from "@/utils/abi-product_nft"
import {
  getAptosClient,
  getSurfClient,
  surfClientProductNFT,
} from "@/utils/aptosClient"
import { GET_COLLECTION_NFTS } from "@/utils/graphql-doc"
import { useApolloClient, useQuery } from "@apollo/client"
import {
  useMutation,
  useQueryClient,
  useQuery as useReactQuery,
} from "@tanstack/react-query"
import { createEntryPayload } from "@thalalabs/surf"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { useState } from "react"
import { toast } from "sonner"

interface NFT {
  token_name: string
  description: string
  token_uri: string
  collection_id: string
  last_transaction_timestamp: string
  token_data_id: string
  token_properties: {
    "Upvote Count": string
    "Product Status": string
    "Product ID": string
  }
  current_token_ownerships: {
    owner_address: string
    amount: number
  }[]
  image?: string
}

interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url: string
}

interface GetCollectionNftsData {
  current_token_datas_v2: NFT[]
}

interface GetCollectionNftsVars {
  collection_name: string
}

export const useRandomProductWithNFT = () => {
  const { client } = useWalletClient()
  const queryClient = useQueryClient()
  const apolloClient = useApolloClient()
  const { keylessAccount } = useKeylessAccount()
  const [matchingNFT, setMatchingNFT] = useState<NFT | null>(null)

  const setRandomProductId = useMutation({
    mutationFn: async () => {
      const payload = createEntryPayload(ABI, {
        function: "set_random_product_id",
        functionArguments: [],
        typeArguments: [],
      })

      const toastId = toast.loading("Setting random product ID...")

      if (keylessAccount) {
        const result = await getSurfClient().submitTransaction({
          payload,
          signer: keylessAccount,
        })
        return { hash: result.hash, toastId }
      }

      if (!client) throw new Error("Wallet client not available")
      const result = await client.useABI(ABI).set_random_product_id({
        arguments: [],
        type_arguments: [],
      })
      return { hash: result.hash, toastId }
    },
    onSuccess: async ({ hash, toastId }) => {
      const executedTransaction = await getAptosClient().waitForTransaction({
        transactionHash: hash,
      })

      queryClient.invalidateQueries({ queryKey: ["randomProductId"] })

      const explorerUrl = `https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${import.meta.env.VITE_APP_NETWORK}`

      toast.success("Random product ID set", {
        id: toastId,
        description: (
          <div>
            <p>Random product ID has been set successfully!</p>
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
      toast.error("Failed to set random product ID", {
        id: (context as { toastId: string })?.toastId,
        description: "An error occurred while setting the random product ID",
      })
    },
  })

  const getRandomProductId = useReactQuery({
    queryKey: ["randomProductId"],
    queryFn: async () => {
      if (!client) throw new Error("Wallet client not available")
      const [result] = await surfClientProductNFT().view.get_random_product_id({
        typeArguments: [],
        functionArguments: [],
      })
      return result
    },
    enabled: false, // This query won't run automatically
  })

  const { loading, error, data } = useQuery<
    GetCollectionNftsData,
    GetCollectionNftsVars
  >(GET_COLLECTION_NFTS, {
    variables: { collection_name: COLLECTION_NAME },
    skip: !COLLECTION_NAME,
  })

  const fetchNFTMetadata = async (nft: NFT) => {
    try {
      const response = await fetch(nft.token_uri)
      const metadata: NFTMetadata = await response.json()
      return { ...nft, image: metadata.image }
    } catch (error) {
      console.error("Error fetching NFT metadata:", error)
      return nft
    }
  }

  const setAndGetRandomProject = async () => {
    await setRandomProductId.mutateAsync()
    const result = await getRandomProductId.refetch()
    return result.data
  }

  const getProjectById = async (productId: string) => {
    if (data?.current_token_datas_v2) {
      const nft = data.current_token_datas_v2.find(
        (nft) => nft.token_properties["Product ID"] === productId
      )
      if (nft) {
        const validOwnership = nft.current_token_ownerships.find(
          (ownership) => ownership.amount > 0
        )
        if (validOwnership) {
          const updatedNFT = await fetchNFTMetadata(nft)
          setMatchingNFT({
            ...updatedNFT,
            current_token_ownerships: [validOwnership],
          })
          return updatedNFT
        }
      }
    }
    return null
  }

  return {
    setAndGetRandomProject,
    getProjectById,
    matchingNFT,
    isLoading: loading || getRandomProductId.isFetching,
    error: error || setRandomProductId.error || getRandomProductId.error,
  }
}
