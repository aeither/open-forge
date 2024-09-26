import { useUpvoteProduct } from "@/hooks/useProductNFT"
import { getAptosClient } from "@/utils/aptosClient"
import { ChevronUp } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface ProjectStatsProps {
  project: {
    description: string
    token_name: string
    token_data_id: string
    token_standard: string
    token_uri: string
    last_transaction_timestamp: string
    token_properties: Record<string, string> // Add this line
  }
}

const getOwnerAddress = async (id: string) => {
  try {
    const ownershipData =
      await getAptosClient().getCurrentDigitalAssetOwnership({
        digitalAssetAddress: id as any,
      })

    if (ownershipData.owner_address) {
      return ownershipData.owner_address
    }
    console.log("Token ownership data not found")
    return null
  } catch (error) {
    console.error("Error fetching token ownership:", error)
    return null
  }
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ project }) => {
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null)
  const [votes, setVotes] = useState(0)
  const [views, setViews] = useState(0)
  const [comments, setComments] = useState(0)
  const upvoteProduct = useUpvoteProduct()

  useEffect(() => {
    const fetchOwnerAddress = async () => {
      const address = await getOwnerAddress(project.token_data_id)
      setOwnerAddress(address)
    }
    fetchOwnerAddress()

    // Set real upvote count from token properties
    setVotes(
      Number.parseInt(project.token_properties["Upvote Count"] || "0", 10)
    )

    // TODO: Fetch actual views and comments data
    setViews(Math.floor(Math.random() * 1000))
    setComments(Math.floor(Math.random() * 50))
  }, [project.token_data_id, project.token_properties])

  const handleUpvote = () => {
    upvoteProduct.mutate(
      {
        productName: project.token_name,
      },
      {
        onSuccess: () => {
          setVotes((prevVotes) => prevVotes + 1)
        },
      }
    )
    console.log(`Upvoted project with id: ${project.token_name}`)
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Builder</h3>
          {ownerAddress && (
            <Link to={`/profile/${ownerAddress}`}>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {ownerAddress.slice(0, 2)}
                </div>
                <span className="text-sm text-gray-600 break-all">
                  {`${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}`}
                </span>
              </div>
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleUpvote}
            className="flex flex-row sm:flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100 transition duration-300 mb-4 sm:mb-0"
          >
            <ChevronUp
              className="text-gray-600 mr-2 sm:mr-0 sm:mb-2"
              size={32}
            />
            <span className="text-2xl font-semibold">{votes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectStats
