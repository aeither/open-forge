import { Header } from "@/components/Header"
import ProjectList from "@/components/ProjectList"
import RecentActivity from "@/components/RecentActivity"

export function Explore() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Explore" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <ProjectList />
          </div>
          <div className="w-full md:w-1/3">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
