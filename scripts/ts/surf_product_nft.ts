import {
  Account,
  Aptos,
  AptosConfig,
  Network,
  NetworkToNetworkName,
  Secp256k1PrivateKey,
} from "@aptos-labs/ts-sdk"
import { createSurfClient } from "@thalalabs/surf"
import dotenv from "dotenv"
import { ABI } from "../../frontend/utils/abi-product_nft"
dotenv.config()

const INITIAL_BALANCE = 100_000_000

const APTOS_NETWORK: Network =
  NetworkToNetworkName[process.env.VITE_APP_NETWORK ?? Network.DEVNET]

const config = new AptosConfig({ network: APTOS_NETWORK })
const aptos = new Aptos(config)
const surfProductNFT = createSurfClient(aptos).useABI(ABI)

if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY not found")

// Create user account
//   const user = Account.generate()
const privateKey = new Secp256k1PrivateKey(process.env.PRIVATE_KEY)
const user = Account.fromPrivateKey({
  privateKey: privateKey,
})

const main = async () => {
  console.log(
    "This example will create an account, issue a share, and buy some of it in the same transaction."
  )

  console.log("=== Address ===\n")
  console.log(`User's address is: ${user.accountAddress}`)

  // Fund and create the account
  // await aptos.fundAccount({
  //   accountAddress: user.accountAddress,
  //   amount: INITIAL_BALANCE,
  // })

  console.log("\n=== Issue share and buy share ===\n")

  await createProductNFT()
  // await mintProductNFT("product 1", "description 1", "uri address")
  // await upvoteProduct(
  //   user.accountAddress as unknown as `0x${string}`,
  //   "product 1",
  //   "Product Showcase"
  // )
}

const createProductNFT = async () => {
  const result = await surfProductNFT.entry.create_collection({
    functionArguments: [],
    typeArguments: [],
    account: user,
  })

  const tx = await aptos.waitForTransaction({
    transactionHash: result.hash,
  })
  console.log(`Transaction status: ${tx.success ? "Success" : "Failed"}`)
  console.log(
    `View transaction on explorer: https://explorer.aptoslabs.com/txn/${tx.hash}?network=${process.env.VITE_APP_NETWORK}`
  )
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

const upvoteProduct = async (
  creatorAddress: `0x${string}`,
  productName: string,
  collectionName: string
) => {
  // First, get the product object
  const productObject = await surfProductNFT.view.get_product_obj({
    functionArguments: [creatorAddress, productName, collectionName],
    typeArguments: [],
  })

  // Now upvote the product
  const result = await surfProductNFT.entry.upvote_product({
    functionArguments: [productObject[0].inner],
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
