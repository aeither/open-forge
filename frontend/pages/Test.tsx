import { aptosClient } from "@/utils/aptosClient"
import { useState } from "react"

function App() {
  const [userAddress, setUserAddress] = useState("")
  const [collectionAddress, setCollectionAddress] = useState("")
  const [nfts, setNfts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function getUserNFTsByCollection(
    userAddress: string,
    collectionAddress: string
  ) {


    try {
      const ownedTokens =
        await aptosClient().getAccountOwnedTokensFromCollectionAddress({
          accountAddress: userAddress,
          collectionAddress: collectionAddress,
        })
      return ownedTokens
    } catch (error) {
      console.error("Error fetching user's NFTs:", error)
      throw error
    }
  }

  const handleFetchNFTs = async () => {
    setLoading(true)
    setError("")
    setNfts([])

    try {
      const fetchedNfts = await getUserNFTsByCollection(
        userAddress,
        collectionAddress
      )
      setNfts(fetchedNfts)
    } catch (error) {
      setError(
        "Failed to fetch NFTs. Please check the addresses and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Aptos NFT Fetcher</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="User Address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Collection Address"
          value={collectionAddress}
          onChange={(e) => setCollectionAddress(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleFetchNFTs}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Fetching..." : "Fetch NFTs"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {nfts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">User's NFTs:</h2>
          <ul>
            {nfts.map((nft, index) => (
              <li key={index} className="mb-2">
                <strong>NFT ID:</strong> {nft.token_data_id}
                <br />
                <strong>NFT Name:</strong> {nft.current_token_data.token_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
