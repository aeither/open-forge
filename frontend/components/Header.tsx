import { Network } from "@aptos-labs/ts-sdk"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { User } from "lucide-react"
import { type FC, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import WalletButtons from "./WalletButtons"
import { WalletSelector } from "./WalletSelector"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

type LaunchpadHeaderProps = {
  title: string
}

export const Header: FC<LaunchpadHeaderProps> = ({ title }) => {
  const { connected, account, network } = useWallet()
  const [isTestnet, setIsTestnet] = useState(true)

  useEffect(() => {
    const checkAndChangeNetwork = async () => {
      if (connected && account) {
        if (network?.name !== Network.TESTNET) {
          setIsTestnet(false)
        } else {
          setIsTestnet(true)
        }
      }
    }

    checkAndChangeNetwork()
  }, [connected, account, network])

  return (
    <header className="border-b relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <h1 className="text-xl font-bold">{title}</h1>
          </Link>
        </div>
        <nav>
          <ul className="flex items-center space-x-2">
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
            <li>
              <WalletButtons />
            </li>
          </ul>
        </nav>
      </div>

      {connected && !isTestnet && (
        <>
          <Badge
            variant={"destructive"}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-auto"
          >
            Please switch to Testnet.
          </Badge>
        </>
      )}
    </header>
  )
}
