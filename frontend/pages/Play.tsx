import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const projects = [
  {
    id: "1",
    name: "AI-Driven Prediction Model",
    description: "Revolutionizing forecasting with machine learning",
    imageUrl:
      "https://res.cloudinary.com/dzkwltgyd/image/upload/v1725532306/glif-run-outputs/yhwd4sxpbgocpgg1mfm0.jpg",
    category: "AI Projects",
  },
  {
    id: "2",
    name: "Decentralized Identity Solution",
    description: "Secure and private identity management on the blockchain",
    imageUrl:
      "https://res.cloudinary.com/dzkwltgyd/image/upload/v1725532672/glif-run-outputs/x4bj0uzwi77g7cnhfqdj.jpg",
    category: "Blockchain Infrastructure",
  },
  {
    id: "3",
    name: "Community Governance Dashboard",
    description: "Empowering decentralized decision-making",
    imageUrl:
      "https://res.cloudinary.com/dzkwltgyd/image/upload/v1725532724/glif-run-outputs/hirsdr3j9dp1lnhkfjy8.jpg",
    category: "Community Tools",
  },
]

const Play: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePass = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
  }

  const handleFund = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + projects.length) % projects.length
    )
  }

  const currentProject = projects[currentIndex]

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header title={"Open Forge"} />
      <main className="flex-1 bg-background">
        <section className="container mx-auto my-8 sm:my-12 max-w-4xl px-4 sm:px-6 lg:px-8">
          <ProjectCard
            {...currentProject}
            onPass={handlePass}
            onFund={handleFund}
          />
        </section>
      </main>
    </div>
  )
}

export default Play

interface ProjectCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
  category: string
  onPass: () => void
  onFund: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  imageUrl,
  category,
  onPass,
  onFund,
}) => {
  const navigate = useNavigate()

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent onClick={() => navigate(`/project/${id}`)}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-64 object-cover rounded-md"
        />
        <div className="mt-2">
          <span className="inline-block bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm font-semibold mr-2">
            {category}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between w-full p-0">
        <Button
          variant="secondary"
          size="lg"
          className="w-1/2 rounded-none h-16 text-lg font-semibold"
          onClick={onPass}
        >
          Pass
        </Button>
        <Button
          variant="default"
          size="lg"
          className="w-1/2 rounded-none h-16 text-lg font-semibold"
          onClick={onFund}
        >
          Fund
        </Button>
      </CardFooter>
    </Card>
  )
}
