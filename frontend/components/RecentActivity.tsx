import { User } from "lucide-react"
import type React from "react"

interface Activity {
  id: number
  user: string
  action: string
  timestamp: string
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: 1,
      user: "Alice",
      action: "upvoted Project A",
      timestamp: "2 minutes ago",
    },
    {
      id: 2,
      user: "Bob",
      action: "commented on Project B",
      timestamp: "15 minutes ago",
    },
    {
      id: 3,
      user: "Charlie",
      action: "submitted a new project",
      timestamp: "1 hour ago",
    },
    // Add more activities as needed
  ]

  return (
    <div className="p-4 rounded-lg shadow-sm bg-white">
      <h2 className="font-semibold mb-4">Recent Activity</h2>
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-center space-x-3">
            <div className="rounded-full p-2">
              <User size={16} />
            </div>
            <div>
              <p>
                <span className="font-semibold">{activity.user}</span>{" "}
                {activity.action}
              </p>
              <p>{activity.timestamp}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentActivity
