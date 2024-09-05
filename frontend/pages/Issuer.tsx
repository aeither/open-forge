import { useParams } from "react-router-dom"

import { Header } from "@/components/Header"
import { IssuerDetails } from "@/components/IssuerDetails"
import { IssuerShareHolders } from "@/components/IssuerShareHolders"
import { TradeShare } from "@/components/TradeShare"
import { UserHoldings } from "@/components/UserHoldings"
import { Card, CardContent } from "@/components/ui/card"

export function Issuer() {
  const { issuerAddress } = useParams()

  return (
    <>
      <Header title="Open Forge" />
      <div className="flex items-center justify-center flex-col">
        <Card>
          <CardContent className="flex flex-col gap-10 pt-6">
            <IssuerDetails issuerAddress={issuerAddress as `0x${string}`} />
            <TradeShare issuerAddress={issuerAddress as `0x${string}`} />
            <IssuerShareHolders
              issuerAddress={issuerAddress as `0x${string}`}
            />
            <UserHoldings userAddress={issuerAddress as `0x${string}`} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
