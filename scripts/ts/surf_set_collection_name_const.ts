import {
  Account,
  type AccountAddressInput,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk"
import { createSurfClient } from "@thalalabs/surf"
import dotenv from "dotenv"
import fs from "node:fs"
import { ABI } from "../../frontend/utils/abi-product_nft"
dotenv.config()

const APTOS_NETWORK: Network =
  NetworkToNetworkName[process.env.VITE_APP_NETWORK ?? Network.TESTNET]

const config = new AptosConfig({ network: APTOS_NETWORK })
const aptos = new Aptos(config)
const surfProductNFT = createSurfClient(aptos).useABI(ABI)

if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY not found")

const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY)
const user = Account.fromPrivateKey({
  privateKey: privateKey,
})

const main = async () => {
  console.log("=== Address ===\n")
  console.log(`User's address is: ${user.accountAddress}`)

  const [collectionName] = await surfProductNFT.view.get_collection_name({
    functionArguments: [],
    typeArguments: [],
  })
  console.log("🚀 ~ main ~ collectionName:", collectionName)

  // Set COLLECTION_NAME in constants.ts
  const constantsPath = "frontend/lib/constants.ts"
  let constantsContent = ""

  if (fs.existsSync(constantsPath)) {
    constantsContent = fs.readFileSync(constantsPath, "utf8")
  }

  const collectionNameRegex = /^export const COLLECTION_NAME = .*$/m
  const newCollectionNameEntry = `export const COLLECTION_NAME = ${JSON.stringify(collectionName)}`

  if (constantsContent.match(collectionNameRegex)) {
    constantsContent = constantsContent.replace(
      collectionNameRegex,
      newCollectionNameEntry
    )
  } else {
    constantsContent += `\n${newCollectionNameEntry}`
  }

  fs.writeFileSync(constantsPath, constantsContent)
  console.log("COLLECTION_NAME saved to frontend/lib/constants.ts")

  const [app_signer_addr] = await surfProductNFT.view.get_app_signer_addr({
    functionArguments: [],
    typeArguments: [],
  })

  const collectionId = await aptos.getCollectionId({
    collectionName: collectionName,
    creatorAddress: app_signer_addr,
  })

  const data = await aptos.getCollectionDataByCollectionId({
    collectionId: collectionId as AccountAddressInput,
  })

  const ownedTokens = await aptos.getAccountOwnedTokensFromCollectionAddress({
    collectionAddress: collectionId as AccountAddressInput,
    accountAddress: app_signer_addr,
  })
  console.log("🚀 ~ main ~ ownedTokens:", ownedTokens)

  const userAddress = "0x123..." // Replace with the actual user address
  const collectionAddress = "0x456..."
  //   await getUserNFTsByCollection(userAddress, collectionAddress)
}

async function getUserNFTsByCollection(
  userAddress: string,
  collectionAddress: string
) {
  try {
    const ownedTokens = await aptos.getAccountOwnedTokensFromCollectionAddress({
      accountAddress: userAddress,
      collectionAddress: collectionAddress,
    })

    console.log("User's NFTs in the collection:", ownedTokens)
    return ownedTokens
  } catch (error) {
    console.error("Error fetching user's NFTs:", error)
    throw error
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })