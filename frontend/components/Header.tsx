import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { Bell, Search, User } from "lucide-react"
import { type FC, useState } from "react"
import { Link } from "react-router-dom"
import { WalletSelector } from "./WalletSelector"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

type LaunchpadHeaderProps = {
  title: string
}

export const Header: FC<LaunchpadHeaderProps> = ({ title }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const { connected, account } = useWallet()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <h1 className="text-xl font-bold">{title}</h1>
          </Link>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
          </div>
        </div>
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Button variant="ghost" asChild>
                <Link to="/explore">Explore</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link to="/upload">Submit</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
            </li>
            {connected && account && (
              <li>
                <Link to={`/profile/${account.address}`}>
                  <Button variant="ghost" size="icon">
                    <User size={20} />
                  </Button>
                </Link>
              </li>
            )}
            <li>
              <WalletSelector />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}