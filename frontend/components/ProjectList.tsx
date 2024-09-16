import { useCollectionNFTs } from "@/hooks/useCollectionNFTs"
import { ChevronUp } from "lucide-react"
import type React from "react"
import { Link } from "react-router-dom"

interface Project {
  id: string
  name: string
  description: string
  image: string
  tags: string[]
  votes: number
}

const ProjectList: React.FC = () => {
  const { loading, error, nftsWithMetadata } = useCollectionNFTs()

  const handleUpvote = (id: string) => {
    // Implement upvote logic here
    console.log(`Upvoted project with id: ${id}`)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const projects: Project[] = nftsWithMetadata.map((nft) => ({
    id: nft.token_data_id,
    name: nft.token_name,
    description: nft.description,
    image: nft.image || "/api/placeholder/80/80",
    tags: Object.keys(nft.token_properties).filter(
      (key) => key !== "Upvote Count" && key !== "Product Status"
    ),
    votes: Number.parseInt(nft.token_properties["Upvote Count"] || "0", 10),
  }))

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Link key={project.id} to={`/project/${project.id}`} className="block">
          <div className="p-4 rounded-lg shadow-sm flex items-center space-x-4 bg-white">
            <img
              src={project.image}
              alt={project.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-sm">{project.description}</p>
              <div className="mt-2 space-x-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                handleUpvote(project.id)
              }}
              className="flex flex-col items-center justify-center p-2 rounded-md"
            >
              <ChevronUp size={20} />
              <span className="text-sm font-semibold">{project.votes}</span>
            </button>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProjectList