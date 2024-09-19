import { useWalletClient } from "@thalalabs/surf/hooks"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { LabeledInput } from "@/components/ui/labeled-input"
import { ABI } from "@/utils/abi-aptos_friend"
import { getAptosClient } from "@/utils/aptosClient"
import { toast } from "sonner"

export function IssueShare() {
  const { client: walletClient } = useWalletClient()

  const [username, setUsername] = useState<string>()

  const onClickIssueShare = async () => {
    if (!walletClient || !username) return

    const resp = await walletClient.useABI(ABI).issue_share({
      type_arguments: [],
      arguments: [username],
    })
    const executedTransaction = await getAptosClient().waitForTransaction({
      transactionHash: resp.hash,
    })
    toast.success("Success", {
      description: (
        <a
          href={`https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${import.meta.env.VITE_APP_NETWORK}`}
        >
          Share issued, view on explorer
        </a>
      ),
    })
  }

  return (
    <>
      <LabeledInput
        label={"Username"}
        required
        tooltip={""}
        value={username}
        type={"text"}
        id={"username"}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button disabled={!walletClient && !username} onClick={onClickIssueShare}>
        Issue Share
      </Button>
    </>
  )
}
