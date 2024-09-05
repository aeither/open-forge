import ProjectList from "@/components/ProjectList"
import RecentActivity from "@/components/RecentActivity"
import { Bell, Search, User } from "lucide-react"
import { useState } from "react"

export function Explore() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Project Explorer</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-8 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                size={18}
              />
            </div>
          </div>
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <a href="#">Explore</a>
              </li>
              <li>
                <a href="#">Submit</a>
              </li>
              <li>
                <Bell className="cursor-pointer" size={20} />
              </li>
              <li>
                <User className="cursor-pointer" size={20} />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Project List */}
          <div className="w-full md:w-2/3">
            <ProjectList />
          </div>

          {/* Right Column: Recent Activity */}
          <div className="w-full md:w-1/3">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
