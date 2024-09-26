// hooks/useNFTDetails.ts
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
        const metadata: NFTMetadata = await response.json()
        return { ...nft, metadata }
      } catch (error) {
        console.error("Error fetching NFT metadata:", error)
        return nft
      }
    }

    const updateNFTWithMetadata = async () => {
      if (
        data?.current_token_ownerships_v2 &&
        data.current_token_ownerships_v2.length > 0
      ) {
        const nft = data.current_token_ownerships_v2[0] as NFT
        const updatedNFT = await fetchNFTMetadata(nft)
        setNftWithMetadata(updatedNFT as NFT & { metadata: NFTMetadata })
      }
    }

    updateNFTWithMetadata()
  }, [data])

  return { loading, error, nftWithMetadata }
}