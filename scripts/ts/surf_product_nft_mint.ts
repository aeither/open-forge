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

const INITIAL_BALANCE = 100_000_000

const APTOS_NETWORK: Network =
  NetworkToNetworkName[process.env.VITE_APP_NETWORK ?? Network.TESTNET]

const config = new AptosConfig({ network: APTOS_NETWORK })
const aptos = new Aptos(config)
const surfProductNFT = createSurfClient(aptos).useABI(ABI)

if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY not found")

// Create user account
//   const user = Account.generate()
const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY)
const user = Account.fromPrivateKey({
  privateKey: privateKey,
})

const main = async () => {
  console.log("=== Address ===\n")
  console.log(`User's address is: ${user.accountAddress}`)

  // Fund and create the account
  // await aptos.fundAccount({
  //   accountAddress: user.accountAddress,
  //   amount: INITIAL_BALANCE,
  // })

  console.log("\n=== Product NFT Mint ===\n")

  // await createProductNFT()

  const PRODUCT_NAME = "Open Forge 2"
  const TOKEN_URI =
    "https://gateway.irys.xyz/DECscf3teYKE86hM8SmiUxPYmnfedQNRGiQhPmofBNRo"
  await mintProductNFT(
    PRODUCT_NAME,
    "Connecting Aptos builders and backers",
    TOKEN_URI
  )
  await upvoteProduct(
    // user.accountAddress as unknown as `0x${string}`,
    PRODUCT_NAME
  )
}

// Must be done manually due to randomness
// const createProductNFT = async () => {
//   const result = await surfProductNFT.entry.create_collection({
//     functionArguments: [],
//     typeArguments: [],
//     account: user,
//   })

//   const tx = await aptos.waitForTransaction({
//     transactionHash: result.hash,
//   })
//   console.log(`Transaction status: ${tx.success ? "Success" : "Failed"}`)
//   console.log(
//     `View transaction on explorer: https://explorer.aptoslabs.com/txn/${tx.hash}?network=${process.env.VITE_APP_NETWORK}`
//   )
// }

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

const upvoteProduct = async (
  productName: string
) => {
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
