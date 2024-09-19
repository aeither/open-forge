import { PRODUCT_NFT_ADDR } from "@/lib/constants"
import { getAptosClient } from "@/utils/aptosClient"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { User } from "lucide-react"

type UpvoteUpdateEvent = {
  account_address: string
  creation_number: number
  data: {
    upvoter: string
    timestamp: string
    new_upvotes: string
    product_addr: string
    product_name: string
  }
  event_index: number
  sequence_number: number
  transaction_block_height: number
  transaction_version: number
  type: string
  indexed_type: string
}

async function fetchProductEvents(): Promise<UpvoteUpdateEvent[]> {
  const eventType = `${PRODUCT_NFT_ADDR}::product_nft::UpvoteUpdate`

  try {
    const events = await getAptosClient().getModuleEventsByEventType({
      eventType: eventType,
    })
    return events as UpvoteUpdateEvent[]
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

const RecentActivity: React.FC = () => {
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["productEvents"],
    queryFn: fetchProductEvents,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching events</div>

  return (
    <div className="p-4 rounded-lg shadow-sm bg-white">
      <h2 className="font-semibold mb-4">Recent Activity</h2>
      <ul className="space-y-4">
        {events?.slice(0, 5).map((event, index) => (
          <li key={index} className="flex items-center space-x-3">
            <div className="rounded-full p-2">
              <User size={16} />
            </div>
            <div>
              <p>
                <span className="font-semibold">
                  {event.data.upvoter.slice(0, 8)}...
                </span>{" "}
                upvoted {event.data.product_name}
              </p>
              <p>
                {formatDistanceToNow(
                  new Date(Number.parseInt(event.data.timestamp) * 1000)
                )}{" "}
                ago
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentActivity