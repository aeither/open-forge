import type React from "react"
import { useState } from "react"

interface Comment {
  id: number
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
}

interface CommentSectionProps {
  projectId: number
}

const CommentSection: React.FC<CommentSectionProps> = ({ projectId }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: { name: "Alice", avatar: "/api/placeholder/40/40" },
      content: "This project looks amazing! I can't wait to try it out.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      user: { name: "Bob", avatar: "/api/placeholder/40/40" },
      content:
        "I've been using this for a week now, and it's really improved my workflow.",
      timestamp: "1 day ago",
    },
  ])

  const [newComment, setNewComment] = useState("")

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        user: { name: "Current User", avatar: "/api/placeholder/40/40" },
        content: newComment.trim(),
        timestamp: "Just now",
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Post Comment
        </button>
      </form>
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center mb-1">
                <span className="font-semibold mr-2">{comment.user.name}</span>
                <span className="text-sm text-gray-500">
                  {comment.timestamp}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentSection
