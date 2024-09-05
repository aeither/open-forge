import { ChevronUp, Eye, MessageSquare } from "lucide-react"
import type React from "react"

interface Contributor {
  id: number
  name: string
  avatar: string
}

interface ProjectStatsProps {
  project: {
    votes: number
    views: number
    comments: number
    contributors: Contributor[]
  }
  onUpvote: () => void
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ project, onUpvote }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <button
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
        <h3 className="text-lg font-semibold mb-2">Contributors</h3>
        <div className="flex flex-wrap">
          {project.contributors.map((contributor) => (
            <img
              key={contributor.id}
              src={contributor.avatar}
              alt={contributor.name}
              title={contributor.name}
              className="w-10 h-10 rounded-full border-2 border-white -ml-2 first:ml-0"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectStats
