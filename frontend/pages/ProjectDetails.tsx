// components/ProjectDetails.tsx
import { Header } from "@/components/Header"
import ProjectStats from "@/components/ProjectStats"
import RelatedProjects from "@/components/RelatedProjects"
import { Button } from "@/components/ui/button"
import { useNFTDetails } from "@/hooks/useNFTDetails"
import { ExternalLink, Github, Share2, Twitter } from "lucide-react"
import { useParams } from "react-router-dom"

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { loading, error, nftWithMetadata } = useNFTDetails(id)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!nftWithMetadata) return <p>NFT not found</p>

  const { current_token_data, owner_address, amount, metadata } =
    nftWithMetadata

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(
      `Check out ${metadata.name} - ${metadata.description}\n\n`
    )
    const tweetUrl = encodeURIComponent(window.location.href)
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`
    window.open(twitterIntentUrl, "_blank")
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen">
      <Header title="Details" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="p-6 rounded-lg shadow-sm">
              <img
                src={metadata.image}
                alt={metadata.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h1 className="text-3xl font-bold mb-2">{metadata.name}</h1>
              <p className="text-xl text-gray-600 mb-4">
                {metadata.description}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <a
                  href={metadata.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} className="mr-1" />
                  Website
                </a>
                <a
                  href={metadata.social_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Twitter size={16} className="mr-1" />X
                </a>
                <a
                  href={metadata.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Github size={16} className="mr-1" />
                  GitHub
                </a>
                <button
                  type="button"
                  onClick={shareOnTwitter}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  <Share2 size={16} className="mr-2" />
                  Share
                </button>
              </div>
              <h2 className="text-2xl font-semibold mb-2">About</h2>
              <p className="text-gray-700 mb-4">{metadata.long_description}</p>
              <h2 className="text-2xl font-semibold mb-2">Details</h2>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Token Standard: {current_token_data.token_standard}</li>
                <li>
                  Token Data ID:{" "}
                  {`${current_token_data.token_data_id.slice(0, 6)}...${current_token_data.token_data_id.slice(-4)}`}
                </li>
                <li>Amount: {amount}</li>
                <li>
                  Last Transaction:{" "}
                  {formatTimestamp(
                    current_token_data.last_transaction_timestamp
                  )}
                </li>
              </ul>
              <Button className="text-white px-6 py-3 rounded-md bg-green-500 hover:bg-green-700 transition duration-300 w-full lg:w-auto">
                Support This Project
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <ProjectStats project={current_token_data} />
            <RelatedProjects />
          </div>
        </div>
      </main>
    </div>
  )
}
