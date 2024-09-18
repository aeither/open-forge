import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk"
import { createSurfClient } from "@thalalabs/surf"
import dotenv from "dotenv"
import { ABI } from "../../frontend/utils/abi-product_nft"
dotenv.config()

const APTOS_NETWORK: Network =
  NetworkToNetworkName[process.env.VITE_APP_NETWORK ?? Network.TESTNET]

const config = new AptosConfig({ network: APTOS_NETWORK })
const aptos = new Aptos(config)
const surfProductNFT = createSurfClient(aptos).useABI(ABI)

if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY not found")

// Use existing user account
const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY)
const user = Account.fromPrivateKey({
  privateKey: privateKey,
})

const main = async () => {
  console.log("=== Address ===\n")
  console.log(`User's address is: ${user.accountAddress}`)

  console.log("\n=== Product NFT Mint ===\n")

  /**
   * View Function
   */
  const [collectionName] = await surfProductNFT.view.get_collection_name({
    functionArguments: [],
    typeArguments: [],
  })
  console.log("Collection Name: ", collectionName)

  /**
   * Entry Function
   */
  const PRODUCT_NAME = "Open Forge 1"
  const TOKEN_URI =
    "https://gateway.irys.xyz/DECscf3teYKE86hM8SmiUxPYmnfedQNRGiQhPmofBNRo"
  await mintProductNFT(
    PRODUCT_NAME,
    "Connecting Aptos builders and backers",
    TOKEN_URI
  )
  await upvoteProduct(PRODUCT_NAME)
}

const mintProductNFT = async (
  name: string,
  description: string,
  uri: string
) => {
  const result = await surfProductNFT.entry.mint_product({
    functionArguments: [name, description, uri],
    typeArguments: [],
    account: user,
  })

  const tx = await aptos.waitForTransaction({
    transactionHash: result.hash,
  })
  console.log(`Mint transaction status: ${tx.success ? "Success" : "Failed"}`)
  console.log(
    `View transaction on explorer: https://explorer.aptoslabs.com/txn/${tx.hash}?network=${process.env.VITE_APP_NETWORK}`
  )
}

const upvoteProduct = async (productName: string) => {
  const result = await surfProductNFT.entry.upvote_product({
    functionArguments: [productName],
    typeArguments: [],
    account: user,
  })

  const tx = await aptos.waitForTransaction({
    transactionHash: result.hash,
  })
  console.log(`Upvote transaction status: ${tx.success ? "Success" : "Failed"}`)
  console.log(
    `View transaction on explorer: https://explorer.aptoslabs.com/txn/${tx.hash}?network=${process.env.VITE_APP_NETWORK}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
