import { ChevronUp } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

interface Project {
  id: number
  name: string
  description: string
  logo: string
  tags: string[]
  votes: number
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "DecentralizedID",
      description: "Self-sovereign identity solution for Aptos users",
      logo: "/api/placeholder/80/80",
      tags: ["Identity", "Privacy"],
      votes: 42,
    },
    {
      id: 2,
      name: "AptosNFTMarket",
      description: "Decentralized marketplace for NFT trading on Aptos",
      logo: "/api/placeholder/80/80",
      tags: ["NFT", "Marketplace"],
      votes: 38,
    },
    {
      id: 3,
      name: "MoveSwap",
      description: "Automated market maker for token swaps on Aptos",
      logo: "/api/placeholder/80/80",
      tags: ["DeFi", "DEX"],
      votes: 35,
    },
    {
      id: 4,
      name: "AptosLend",
      description: "Peer-to-peer lending protocol built on Aptos",
      logo: "/api/placeholder/80/80",
      tags: ["DeFi", "Lending"],
      votes: 32,
    },
    {
      id: 5,
      name: "MoveOracle",
      description: "Decentralized oracle network for Aptos smart contracts",
      logo: "/api/placeholder/80/80",
      tags: ["Oracle", "Infrastructure"],
      votes: 28,
    },
  ])

  const handleUpvote = (id: number) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, votes: project.votes + 1 } : project
      )
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Link key={project.id} to={`/project/${project.id}`} className="block">
          <div
            key={project.id}
            className="p-4 rounded-lg shadow-sm flex items-center space-x-4 bg-white"
          >
            <img
              src={project.logo}
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
              onClick={() => handleUpvote(project.id)}
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
