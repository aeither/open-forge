import { COLLECTION_NAME } from "@/lib/constants"
import { GET_COLLECTION_NFTS } from "@/utils/graphql-doc"
import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"

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
  }
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

export function useCollectionNFTs() {
  const [nftsWithMetadata, setNftsWithMetadata] = useState<NFT[]>([])

  const { loading, error, data } = useQuery<
    GetCollectionNftsData,
    GetCollectionNftsVars
  >(GET_COLLECTION_NFTS, {
    variables: { collection_name: COLLECTION_NAME },
    skip: !COLLECTION_NAME,
  })

  useEffect(() => {
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

    const updateNFTsWithMetadata = async () => {
      if (data?.current_token_datas_v2) {
        const updatedNFTs = await Promise.all(
          data.current_token_datas_v2.map(fetchNFTMetadata)
        )
        setNftsWithMetadata(updatedNFTs)
      }
    }

    updateNFTsWithMetadata()
  }, [data])

  return { loading, error, nftsWithMetadata }
}