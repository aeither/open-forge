import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toggle } from "@/components/ui/toggle"
import { useToast } from "@/components/ui/use-toast"
import { useGetHolding, useGetIssuerObjectAddress } from "@/hooks/useHolding"
import { ABI } from "@/utils/abi-aptos_friend"

type TradeShareProps = {
  issuerAddress: `0x${string}`
}

export function TradeShare({ issuerAddress }: TradeShareProps) {
  const { client: walletClient } = useWalletClient()
  const { account } = useWallet()
  const { toast } = useToast()
  const holding = useGetHolding(
    issuerAddress,
    account?.address as `0x${string}`
  )
  const issuerObjectAddress = useGetIssuerObjectAddress(issuerAddress)

  const [amount, setAmount] = useState(0)
  const [isBuying, setIsBuying] = useState(true)

  const handleTradeSubmit = async () => {
    if (!walletClient || !issuerObjectAddress) return

    let resp: any
    if (isBuying) {
      resp = await walletClient.useABI(ABI).buy_share({
        type_arguments: [],
        arguments: [issuerObjectAddress, amount],
      })
    } else {
      resp = await walletClient.useABI(ABI).sell_share({
        type_arguments: [],
        arguments: [issuerObjectAddress, amount],
      })
    }

    const executedTransaction = await getAptosClient().waitForTransaction({
      transactionHash: resp.hash,
    })

    toast({
      title: "Success",
      description: (
        <a
          href={`https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${import.meta.env.VITE_APP_NETWORK}`}
        >
          Share {isBuying ? "bought" : "sold"}, view on explorer
        </a>
      ),
    })
    setAmount(0)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trade Share</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Toggle
            aria-label="Buy"
            className={
              isBuying === true ? "bg-primary text-primary-foreground" : ""
            }
            onClick={() => setIsBuying(true)}
          >
            Buy
          </Toggle>
          <Toggle
            aria-label="Sell"
            className={
              isBuying === false ? "bg-primary text-primary-foreground" : ""
            }
            onClick={() => setIsBuying(false)}
          >
            Sell
          </Toggle>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number.parseInt(e.target.value))}
            placeholder="Enter amount"
          />
        </div>
        <Button onClick={handleTradeSubmit} className="w-full">
          {isBuying ? "Buy" : "Sell"}
        </Button>
        <div className="flex items-center justify-between">
          <span>Your Balance:</span>
          <span className="font-medium">{holding?.shares}</span>
        </div>
      </CardContent>
    </Card>
  )
}
