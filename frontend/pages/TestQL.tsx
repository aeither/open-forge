import { COLLECTION_NAME } from "@/lib/constants"
import { gql, useQuery } from "@apollo/client"
import type React from "react"
import { useEffect, useState } from "react"

interface NFT {
  token_name: string
  description: string
  token_uri: string
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

// https://cloud.hasura.io/public/graphiql?endpoint=https://api.testnet.aptoslabs.com/v1/graphql
const GET_COLLECTION_NFTS = gql`
query GetCollectionNfts($collection_name: String) {
  current_token_datas_v2(
    where: {current_collection: {collection_name: {_eq: $collection_name}}}
    order_by: {last_transaction_timestamp: desc}
  ) {
    token_name
    description
    token_uri
    collection_id
    last_transaction_timestamp
    token_data_id
    token_properties
  }
}
`

const CollectionNftsPage: React.FC = () => {
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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        NFTs in Collection: {COLLECTION_NAME}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nftsWithMetadata.map((nft: NFT, index: number) => (
          <div key={index} className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-2">{nft.token_name}</h2>
            {nft.image && (
              <img
                src={nft.image}
                alt={nft.token_name}
                className="w-full h-auto mb-2"
              />
            )}
            <p className="mb-2">
              <strong>Description:</strong> {nft.description}
            </p>
            <p className="mb-2">
              <strong>Token URI:</strong> {nft.token_uri}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CollectionNftsPage