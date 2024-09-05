import { Header } from "@/components/Header"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import type React from "react"
import { useState } from "react"

// Define types
type LeaderboardItem = {
  id: number
  rank: number
  name: string
  avatar: string
  score: number
  description: string
}

type LeaderboardType = "Users" | "Projects" | "Organizations"

const Leaderboard: React.FC = () => {
  const [leaderboardType, setLeaderboardType] =
    useState<LeaderboardType>("Users")
  const [timeFilter, setTimeFilter] = useState("This Week")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data for leaderboard items
  const leaderboardItems: LeaderboardItem[] = [
    {
      id: 1,
      rank: 1,
      name: "John Doe",
      avatar: "/path/to/avatar1.jpg",
      score: 1250,
      description: "Full-stack developer",
    },
    {
      id: 2,
      rank: 2,
      name: "Jane Smith",
      avatar: "/path/to/avatar2.jpg",
      score: 1100,
      description: "UX Designer",
    },
    {
      id: 3,
      rank: 3,
      name: "Bob Johnson",
      avatar: "/path/to/avatar3.jpg",
      score: 950,
      description: "Product Manager",
    },
    // ... add more items as needed
  ]

  const itemsPerPage = 10
  const totalPages = Math.ceil(leaderboardItems.length / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <Header title="Leaderboard" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-gray-600 mt-2">
            Top contributors based on their activity and impact
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Leaderboard List */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    {["Users", "Projects", "Organizations"].map((type) => (
                      <button
                        key={type}
                        className={`px-3 py-2 rounded-md ${leaderboardType === type ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
                        onClick={() =>
                          setLeaderboardType(type as LeaderboardType)
                        }
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <ul>
                {leaderboardItems
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((item, index) => (
                    <li
                      key={item.id}
                      className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <span className="font-bold text-lg w-8">{item.rank}</span>
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {item.score} pts
                      </span>
                    </li>
                  ))}
              </ul>
              <div className="p-4 border-t flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Filters and Info */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-bold mb-2">Filters</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period
                </label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                  <option>All Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option>All Categories</option>
                  <option>Technology</option>
                  <option>Design</option>
                  <option>Marketing</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-bold mb-2">Leaderboard Criteria</h3>
              <p className="text-sm text-gray-600">
                Rankings are based on user activity, including submissions,
                comments, and upvotes.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-2">Recent Changes</h3>
              <ul className="text-sm">
                <li className="flex items-center text-green-600">
                  <ChevronUp size={16} />
                  <span>John Doe moved up 2 spots</span>
                </li>
                <li className="flex items-center text-red-600">
                  <ChevronDown size={16} />
                  <span>Jane Smith moved down 1 spot</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Leaderboard
