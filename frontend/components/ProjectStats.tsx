import { aptosClient } from "@/utils/aptosClient"
import { ChevronUp, Eye, MessageSquare } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface Contributor {
  id: number
  name: string
  avatar: string
}

interface ProjectStatsProps {
  project: {
    id: string
    votes: number
    views: number
    comments: number
    contributor: Contributor
  }
  onUpvote: () => void
}

const getOwnerAddress = async (id: string) => {
  try {
    const ownershipData = await aptosClient().getCurrentDigitalAssetOwnership({
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

const ProjectStats: React.FC<ProjectStatsProps> = ({ project, onUpvote }) => {
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null)

  useEffect(() => {
    const fetchOwnerAddress = async () => {
      const address = await getOwnerAddress(project.id)
      setOwnerAddress(address)
    }
    fetchOwnerAddress()
  }, [project.id])

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onUpvote}
          className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100 transition duration-300"
        >
          <ChevronUp className="text-gray-600" size={32} />
          <span className="text-2xl font-semibold">{project.votes}</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Eye className="text-gray-600 mr-2" size={20} />
            <span className="text-lg">{project.views}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="text-gray-600 mr-2" size={20} />
            <span className="text-lg">{project.comments}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Contributor</h3>
        <Link to={`/profile/${ownerAddress}`}>
          <img
            src={project.contributor.avatar}
            alt={project.contributor.name}
            title={project.contributor.name}
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
          />
        </Link>
      </div>
    </div>
  )
}

export default ProjectStats
