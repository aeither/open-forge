import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useParams } from "react-router-dom"

import { Header } from "@/components/Header"
import { IssueShare } from "@/components/IssueShare"
import { IssuerDetails } from "@/components/IssuerDetails"
import { IssuerShareHolders } from "@/components/IssuerShareHolders"
import { TradeShare } from "@/components/TradeShare"
import { UserHoldings } from "@/components/UserHoldings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useHasIssuedShare } from "@/hooks/useIssuer"

export function Profile() {
  const { issuerAddress } = useParams()
  const { connected, account } = useWallet()
  const userAddress = connected && account ? account.address : null
  const hasIssuedShare = useHasIssuedShare(userAddress as `0x${string}`)

  const isOwnProfile = userAddress === issuerAddress
  const profileAddress = isOwnProfile ? userAddress : issuerAddress

  return (
    <>
      <Header title={isOwnProfile ? "My Profile" : "User Profile"} />
      <div className="flex items-center justify-center flex-col">
        {connected && account ? (
          <Card>
            <CardContent className="flex flex-col gap-10 pt-6">
              {isOwnProfile && !hasIssuedShare ? (
                <IssueShare />
              ) : (
                <>
                  <IssuerDetails
                    issuerAddress={profileAddress as `0x${string}`}
                  />
                  <TradeShare issuerAddress={profileAddress as `0x${string}`} />
                  <IssuerShareHolders
                    issuerAddress={profileAddress as `0x${string}`}
                  />
                </>
              )}
              <UserHoldings userAddress={profileAddress as `0x${string}`} />
            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>Connect a wallet to see the profile</CardTitle>
          </CardHeader>
        )}
      </div>
    </>
  )
}