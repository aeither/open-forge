import { getAptosClient } from "@/utils/aptosClient"
import { ChevronUp, Eye, MessageSquare } from "lucide-react"
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

  useEffect(() => {
    const fetchOwnerAddress = async () => {
      const address = await getOwnerAddress(project.token_data_id)
      setOwnerAddress(address)
    }
    fetchOwnerAddress()

    // TODO: Fetch actual votes, views, and comments data
    setVotes(Math.floor(Math.random() * 100))
    setViews(Math.floor(Math.random() * 1000))
    setComments(Math.floor(Math.random() * 50))
  }, [project.token_data_id])

  const handleUpvote = () => {
    setVotes((prevVotes) => prevVotes + 1)
    // TODO: Implement actual upvote logic
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handleUpvote}
          className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100 transition duration-300"
        >
          <ChevronUp className="text-gray-600" size={32} />
          <span className="text-2xl font-semibold">{votes}</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Eye className="text-gray-600 mr-2" size={20} />
            <span className="text-lg">{views}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="text-gray-600 mr-2" size={20} />
            <span className="text-lg">{comments}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Owner</h3>
        {ownerAddress && (
          <Link to={`/profile/${ownerAddress}`}>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                {ownerAddress.slice(0, 2)}
              </div>
              <span className="text-sm text-gray-600">{`${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}`}</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default ProjectStats