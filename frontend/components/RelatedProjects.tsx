import { useCollectionNFTs } from "@/hooks/useCollectionNFTs"
import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface RelatedProject {
  id: string
  name: string
  description: string
  image: string
}

const RelatedProjects: React.FC = () => {
  const { loading, error, nftsWithMetadata } = useCollectionNFTs()
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([])

  useEffect(() => {
    if (nftsWithMetadata.length > 0) {
      const shuffled = [...nftsWithMetadata].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 3).map((nft) => ({
        id: nft.token_data_id,
        name: nft.token_name,
        description: nft.description,
        image: nft.image || "/api/placeholder/40/40",
      }))
      setRelatedProjects(selected)
    }
  }, [nftsWithMetadata])

  if (loading) return <div>Loading related projects...</div>
  if (error) return <div>Error loading related projects: {error.message}</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Related Projects</h3>
      <div className="space-y-4">
        {relatedProjects.map((project) => (
          <Link key={project.id} to={`/project/${project.id}`}>
            <div className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition duration-300">
              <img
                src={project.image}
                alt={project.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold">{project.name}</h4>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {project.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedProjects