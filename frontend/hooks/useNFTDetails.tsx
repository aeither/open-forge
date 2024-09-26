import { GET_ACCOUNT_NFT } from "@/utils/graphql-doc"
import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"

interface NFTData {
  description: string
  token_name: string
  token_data_id: string
  token_standard: string
  token_uri: string
  last_transaction_timestamp: string
  token_properties: {
    "Upvote Count": string
    "Product Status": string
  }
}

interface NFT {
  current_token_data: NFTData
  owner_address: string
  amount: number
}

interface NFTMetadata {
  description: string
  image: string
  name: string
  external_url: string
  social_url: string
  long_description: string
  github_url: string
}

export function useNFTDetails(tokenDataId: string | undefined) {
  const [nftWithMetadata, setNftWithMetadata] = useState<
    (NFT & { metadata: NFTMetadata }) | null
  >(null)

  const { loading, error, data } = useQuery(GET_ACCOUNT_NFT, {
    variables: { token_data_id: tokenDataId },
    skip: !tokenDataId,
  })

  useEffect(() => {
    const fetchNFTMetadata = async (nft: NFT) => {
      try {
        const response = await fetch(nft.current_token_data.token_uri)
        console.log(
          "🚀 ~ fetchNFTMetadata ~ response:",
          nft
        )
        const metadata: NFTMetadata = await response.json()
        return { ...nft, metadata }
      } catch (error) {
        console.error("Error fetching NFT metadata:", error)
        return nft
      }
    }

    const updateNFTWithMetadata = async () => {
      if (data?.current_token_ownerships_v2) {
        // Find the first NFT with amount > 0
        const validNFT = data.current_token_ownerships_v2.find(
          (nft: NFT) => nft.amount > 0
        ) as NFT | undefined

        if (validNFT) {
          const updatedNFT = await fetchNFTMetadata(validNFT)
          setNftWithMetadata(updatedNFT as NFT & { metadata: NFTMetadata })
        } else {
          setNftWithMetadata(null) // No valid NFT found
        }
      }
    }

    updateNFTWithMetadata()
  }, [data])

  return { loading, error, nftWithMetadata }
}