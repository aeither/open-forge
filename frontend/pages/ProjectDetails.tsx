import CommentSection from "@/components/CommentSection"
import { Header } from "@/components/Header"
import ProjectStats from "@/components/ProjectStats"
import RelatedProjects from "@/components/RelatedProjects"
import { Button } from "@/components/ui/button"
import { ExternalLink, Share2 } from "lucide-react"
import type React from "react"
import { useState } from "react"

interface Contributor {
  id: number
  name: string
  avatar: string
}

interface Project {
  id: number
  name: string
  tagline: string
  description: string
  logo: string
  tags: string[]
  website: string
  votes: number
  views: number
  comments: number
  contributors: Contributor[]
}

export const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<Project>({
    id: 1,
    name: "Project Explorer",
    tagline: "Discover and showcase innovative projects",
    description:
      "Project Explorer is a platform designed to help developers and creators showcase their projects to a wide audience. It provides tools for project discovery, collaboration, and feedback, fostering a vibrant community of innovators.",
    logo: "/api/placeholder/150/150",
    tags: ["Web Development", "Open Source", "Community"],
    website: "https://projectexplorer.example.com",
    votes: 1337,
    views: 5000,
    comments: 42,
    contributors: [
      { id: 1, name: "Alice", avatar: "/api/placeholder/40/40" },
      { id: 2, name: "Bob", avatar: "/api/placeholder/40/40" },
      { id: 3, name: "Charlie", avatar: "/api/placeholder/40/40" },
    ],
  })

  const handleUpvote = () => {
    setProject((prev) => ({ ...prev, votes: prev.votes + 1 }))
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header title="Details" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Project Information */}
          <div className="w-full lg:w-2/3">
            <div className="p-6 rounded-lg shadow-sm">
              <img
                src={project.logo}
                alt={project.name}
                className="w-40 h-40 object-cover rounded-lg mb-4"
              />
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{project.tagline}</p>
              <div className="flex items-center space-x-4 mb-6">
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} className="mr-1" />
                  Visit Website
                </a>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                  <Share2 size={16} className="mr-2" />
                  Share
                </button>
              </div>
              <h2 className="text-2xl font-semibold mb-2">About</h2>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Easy project submission and discovery</li>
                <li>Community-driven feedback and voting system</li>
                <li>Collaboration tools for project teams</li>
                <li>Detailed analytics and insights for project creators</li>
              </ul>
              <div className="mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button className="text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300">
                Support This Project
              </Button>
            </div>
          </div>

          {/* Right Column: Project Stats and Related Content */}
          <div className="w-full lg:w-1/3">
            <ProjectStats project={project} onUpvote={handleUpvote} />
            <RelatedProjects />
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection projectId={project.id} />
        </div>
      </main>
    </div>
  )
}
