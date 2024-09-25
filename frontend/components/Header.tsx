import { Network } from "@aptos-labs/ts-sdk"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { Menu, User } from "lucide-react"
import { type FC, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { WalletSelector } from "./WalletSelector"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

type LaunchpadHeaderProps = {
  title: string
}

export const Header: FC<LaunchpadHeaderProps> = ({ title }) => {
  const { connected, account, network } = useWallet()
  const [isTestnet, setIsTestnet] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

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

  const NavItems = () => (
    <>
      <li>
        <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
          <Link to="/explore">Explore</Link>
        </Button>
      </li>
      <li>
        <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
          <Link to="/upload">Submit</Link>
        </Button>
      </li>
      {connected && account && (
        <li>
          <Link
            to={`/profile/${account.address}`}
            onClick={() => setIsOpen(false)}
          >
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
          </Link>
        </li>
      )}
    </>
  )

  return (
    <header className="border-b relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <h1 className="text-xl font-bold">{title}</h1>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-2">
          <ul className="flex items-center space-x-2 list-none">
            <NavItems />
          </ul>
          <WalletSelector />
        </nav>
        <div className="md:hidden flex items-center space-x-2">
          <WalletSelector />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <ul className="flex flex-col space-y-4 list-none">
                  <NavItems />
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {connected && !isTestnet && (
        <Badge
          variant={"destructive"}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-auto"
        >
          Please switch to Testnet.
        </Badge>
      )}
    </header>
  )
}