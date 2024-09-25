import {
  Account,
  Aptos,
  AptosConfig,
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

const INITIAL_BALANCE = 100_000_000 // 1 APT

const products = [
  {
    name: "AptosSwap",
    description: "Swap tokens at light speed on the Aptos highway",
    uri: "https://example.com/aptosswap",
  },
  {
    name: "Pixel Bazaar",
    description: "Your digital treasures, traded in milliseconds on Aptos",
    uri: "https://example.com/pixelbazaar",
  },
  {
    name: "LoanSphere",
    description: "Borrow and lend with the power of Aptos behind you",
    uri: "https://example.com/loansphere",
  },
  {
    name: "ChainLink",
    description: "Bridge the gap between blockchains, powered by Aptos",
    uri: "https://example.com/chainlink",
  },
  {
    name: "VoxDAO",
    description: "Your voice in the Aptos ecosystem, amplified",
    uri: "https://example.com/voxdao",
  },
  {
    name: "GameVerse",
    description: "Level up your gaming experience on the Aptos blockchain",
    uri: "https://example.com/gameverse",
  },
  {
    name: "CryptoID",
    description: "Your digital identity, secured by Aptos",
    uri: "https://example.com/cryptoid",
  },
  {
    name: "AptosPay",
    description: "Payments at the speed of thought, powered by Aptos",
    uri: "https://example.com/aptospay",
  },
  {
    name: "NeuralChain",
    description: "Where AI meets blockchain: Smarter DApps on Aptos",
    uri: "https://example.com/neuralchain",
  },
  {
    name: "TruthBeacon",
    description: "Illuminating off-chain data for Aptos smart contracts",
    uri: "https://example.com/truthbeacon",
  },
  {
    name: "FortKnox",
    description: "Fort Knox-level security for your digital assets on Aptos",
    uri: "https://example.com/fortknox",
  },
  {
    name: "TradeSphere",
    description: "Trade like a pro with Aptos-powered order books",
    uri: "https://example.com/tradesphere",
  },
  {
    name: "AptosLaunch",
    description: "Catapult your project into the Aptos stratosphere",
    uri: "https://example.com/aptoslaunch",
  },
  {
    name: "MoveMint",
    description: "Mint and manage your Move-powered tokens with ease",
    uri: "https://example.com/movemint",
  },
]

const main = async () => {
  console.log("=== Seeding Aptos App ===\n")

  // Create 5 builders
  const builders = await Promise.all(
    Array(5)
      .fill(0)
      .map(async () => {
        const account = Account.generate()
        await aptos.fundAccount({
          accountAddress: account.accountAddress,
          amount: INITIAL_BALANCE,
        })
        return account
      })
  )

  console.log("Created 5 builders:")
  builders.forEach((builder, index) => {
    console.log(`Builder ${index + 1} address: ${builder.accountAddress}`)
  })

  // Mint products and distribute them among builders
  for (const product of products) {
    const randomBuilder = builders[Math.floor(Math.random() * builders.length)]
    await mintProductNFT(
      randomBuilder,
      product.name,
      product.description,
      product.uri
    )
  }

  // Random upvotes
  for (const product of products) {
    const upvotes = Math.floor(Math.random() * 5) + 1 // 1 to 5 upvotes
    for (let i = 0; i < upvotes; i++) {
      const randomBuilder =
        builders[Math.floor(Math.random() * builders.length)]
      await upvoteProduct(randomBuilder, product.name)
    }
  }

  console.log("\nSeeding completed successfully!")
}

const mintProductNFT = async (
  builder: Account,
  name: string,
  description: string,
  uri: string
) => {
  const result = await surfProductNFT.entry.mint_product({
    functionArguments: [name, description, uri],
    typeArguments: [],
    account: builder,
  })

  const tx = await aptos.waitForTransaction({
    transactionHash: result.hash,
  })
  console.log(
    `Minted "${name}" by ${builder.accountAddress.toString().slice(0, 6)}... | Status: ${tx.success ? "Success" : "Failed"}`
  )
}

const upvoteProduct = async (voter: Account, productName: string) => {
  const result = await surfProductNFT.entry.upvote_product({
    functionArguments: [productName],
    typeArguments: [],
    account: voter,
  })

  const tx = await aptos.waitForTransaction({
    transactionHash: result.hash,
  })
  console.log(
    `Upvoted "${productName}" by ${voter.accountAddress.toString().slice(0, 6)}... | Status: ${tx.success ? "Success" : "Failed"}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
