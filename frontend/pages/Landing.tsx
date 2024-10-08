import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

import { Header } from "@/components/Header"
import Marquee from "@/components/magicui/marquee"
import { Badge } from "@/components/ui/badge"

const openForgeProjects = [
  {
    name: "AI-Driven Prediction Model",
    img: "https://res.cloudinary.com/dzkwltgyd/image/upload/v1725532306/glif-run-outputs/yhwd4sxpbgocpgg1mfm0.jpg",
    category: "AI Projects",
    isFeatured: true,
  },
  {
    name: "Decentralized Identity Solution",
    img: "https://res.cloudinary.com/dzkwltgyd/image/upload/v1725532672/glif-run-outputs/x4bj0uzwi77g7cnhfqdj.jpg",
    category: "Blockchain Infrastructure",
    isFeatured: false,
  },
  {
    name: "Community Governance Dashboard",
    img: "https://res.cloudinary.com/dzkwltgyd/image/upload/v1725532724/glif-run-outputs/hirsdr3j9dp1lnhkfjy8.jpg",
    category: "Community Tools",
    isFeatured: true,
  },
  {
    name: "Eco-Friendly Smart Contract Optimizer",
    img: "https://res.cloudinary.com/dzkwltgyd/image/upload/v1725536887/glif-run-outputs/ruocjkwlgohb9s1juq3j.jpg",
    category: "Blockchain Infrastructure",
    isFeatured: false,
  },
  {
    name: "Open Source Contributor",
    img: "https://res.cloudinary.com/dzkwltgyd/image/upload/v1725532767/glif-run-outputs/d3rkbvm50fds3hrqyyvk.jpg",
    category: "Top Contributors",
    achievementLevel: "Gold",
  },
  {
    name: "Public Goods Champion",
    img: "https://res.cloudinary.com/dzkwltgyd/image/upload/v1725532804/glif-run-outputs/yqsfnvexboagunrhjaek.jpg",
    category: "Achievements",
    achievementLevel: "Platinum",
  },
]
const firstRow = openForgeProjects.slice(0, openForgeProjects.length / 2)
const secondRow = openForgeProjects.slice(openForgeProjects.length / 2)

const ProjectCard = ({
  img,
  name,
  isFeatured,
}: (typeof openForgeProjects)[number]) => {
  return (
    <figure
      className={cn(
        "relative w-48 sm:w-64 cursor-pointer overflow-hidden rounded-xl",
        "bg-gradient-to-t from-black to-transparent",
        "hover:from-black/80"
      )}
    >
      <div className="absolute inset-0">
        {img && (
          <img src={img} alt={name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end p-4">
        <h3 className="text-sm sm:text-xl font-bold text-white">{name}</h3>
        <div>{isFeatured && <Badge className="text-xs">FEATURED</Badge>}</div>
      </div>
    </figure>
  )
}

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header title={"Open Forge"} />
      <main className="flex-1 bg-background">
        <section className="container mx-auto my-8 sm:my-12 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-xl bg-white p-6 sm:p-8 shadow-lg">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10" />
            <div className="relative z-10">
              <h1 className="mb-4 text-center text-3xl sm:text-4xl lg:text-6xl font-bold">
                Boost Open-Source Projects with Gamified Funding
              </h1>
              <p className="mb-6 sm:mb-8 text-center text-base sm:text-lg text-muted-foreground">
                Open Forge transforms how open-source projects thrive in the
                Aptos ecosystem. Our platform makes funding and supporting
                innovative projects easy, fair, and fun.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/play">
                  <Button size="sm" className="w-full sm:w-auto">
                    Surprise me 😲
                  </Button>
                </Link>
                <Link to="/explore" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    View Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <section className="bg-muted py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 sm:mb-8 text-center text-xl sm:text-2xl font-bold">
            Join Our Community of Innovators
          </h2>
          <div className="relative h-[200px] sm:h-[300px] w-full overflow-hidden rounded-lg border bg-background md:shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-hidden">
                <Marquee pauseOnHover className="h-full [--duration:20s]">
                  {firstRow.map((project) => (
                    <ProjectCard key={project.name} {...project} />
                  ))}
                </Marquee>
              </div>
              <div className="flex-1 overflow-hidden">
                <Marquee
                  reverse
                  pauseOnHover
                  className="h-full [--duration:20s]"
                >
                  {secondRow.map((project) => (
                    <ProjectCard key={project.name} {...project} />
                  ))}
                </Marquee>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background" />
          </div>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link to="/upload" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Submit Your Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
