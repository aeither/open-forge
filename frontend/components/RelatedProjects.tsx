import type React from "react"

interface RelatedProject {
  id: number
  name: string
  description: string
  logo: string
}

const RelatedProjects: React.FC = () => {
  const relatedProjects: RelatedProject[] = [
    {
      id: 1,
      name: "Project A",
      description: "A task management solution",
      logo: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "Project B",
      description: "An AI-powered code assistant",
      logo: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Project C",
      description: "A collaborative design tool",
      logo: "/api/placeholder/40/40",
    },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Related Projects</h3>
      <div className="space-y-4">
        {relatedProjects.map((project) => (
          <div key={project.id} className="flex items-center space-x-3">
            <img
              src={project.logo}
              alt={project.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-semibold">{project.name}</h4>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProjects
