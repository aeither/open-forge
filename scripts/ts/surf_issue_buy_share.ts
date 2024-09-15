import {
  Account,
  Aptos,
  AptosConfig,
  Network,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk"
import { createSurfClient } from "@thalalabs/surf"
import dotenv from "dotenv"
dotenv.config()

const INITIAL_BALANCE = 100_000_000

const APTOS_NETWORK: Network =
  NetworkToNetworkName[process.env.VITE_APP_NETWORK ?? Network.DEVNET]

const config = new AptosConfig({ network: APTOS_NETWORK })
const aptos = new Aptos(config)
const surfClient = createSurfClient(aptos)

// Assume we have the ABI for the aptos_friend module
import { ABI as APTOS_FRIEND_ABI } from "../../frontend/utils/abi-aptos_friend"

const main = async () => {
  console.log(
    "This example will create an account, issue a share, and buy some of it in the same transaction."
  )

  // Create user account
  const user = Account.generate()
  //   const privateKey = new Secp256k1PrivateKey("PRIVATE_KEY_HERE")
  //   const user = Account.fromPrivateKey({
  //     privateKey: privateKey,
  //   })

  console.log("=== Address ===\n")
  console.log(`User's address is: ${user.accountAddress}`)

  // Fund and create the account
  await aptos.fundAccount({
    accountAddress: user.accountAddress,
    amount: INITIAL_BALANCE,
  })

  console.log("\n=== Issue share and buy share ===\n")

  // Use Surf to create and submit the transaction
  const issueResult = await surfClient
    .useABI(APTOS_FRIEND_ABI)
    .entry.issue_share({
      functionArguments: [Math.random().toString(36).substr(2, 9)],
      typeArguments: [],
      account: user,
    })

  const issueExecutedTransaction = await aptos.waitForTransaction({
    transactionHash: issueResult.hash,
  })
  console.log(
    `Transaction status: ${issueExecutedTransaction.success ? "Success" : "Failed"}`
  )
  console.log(
    `View transaction on explorer: https://explorer.aptoslabs.com/txn/${issueExecutedTransaction.hash}?network=${process.env.VITE_APP_NETWORK}`
  )

  const issuer_obj = await surfClient
    .useABI(APTOS_FRIEND_ABI)
    .view.get_issuer_obj({
      functionArguments: [user.accountAddress as unknown as `0x${string}`],
      typeArguments: [],
    })
  const buyResult = await surfClient.useABI(APTOS_FRIEND_ABI).entry.buy_share({
    functionArguments: [
      issuer_obj[0].inner,
      Math.floor(Math.random() * 14) + 2,
    ],
    typeArguments: [],
    account: user,
  })

  const buyExecutedTransaction = await aptos.waitForTransaction({
    transactionHash: buyResult.hash,
  })
  console.log(
    `Transaction status: ${buyExecutedTransaction.success ? "Success" : "Failed"}`
  )
  console.log(
    `View transaction on explorer: https://explorer.aptoslabs.com/txn/${buyExecutedTransaction.hash}?network=${process.env.VITE_APP_NETWORK}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
