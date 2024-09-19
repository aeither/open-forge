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
    name: "Open Forge 1",
    description: "Connecting Aptos builders and backers",
    uri: "https://example.com/openforge1",
  },
  {
    name: "AptosSwap",
    description: "Decentralized exchange on Aptos",
    uri: "https://example.com/aptosswap",
  },
  {
    name: "NFT Marketplace",
    description: "Trade unique digital assets on Aptos",
    uri: "https://example.com/nftmarket",
  },
  {
    name: "AptosLend",
    description: "Decentralized lending protocol",
    uri: "https://example.com/aptoslend",
  },
  {
    name: "AptosBridge",
    description: "Cross-chain bridge for Aptos",
    uri: "https://example.com/aptosbridge",
  },
  {
    name: "AptosDAO",
    description: "Decentralized governance for Aptos projects",
    uri: "https://example.com/aptosdao",
  },
  {
    name: "AptosPlay",
    description: "Blockchain gaming platform on Aptos",
    uri: "https://example.com/aptosplay",
  },
  {
    name: "AptosID",
    description: "Decentralized identity solution",
    uri: "https://example.com/aptosid",
  },
  {
    name: "AptosPay",
    description: "Payment solution for Aptos ecosystem",
    uri: "https://example.com/aptospay",
  },
  {
    name: "AptosAI",
    description: "AI-powered DApps on Aptos",
    uri: "https://example.com/aptosai",
  },
  {
    name: "AptosOracle",
    description: "Decentralized oracle network for Aptos",
    uri: "https://example.com/aptosoracle",
  },
  {
    name: "AptosVault",
    description: "Secure asset management on Aptos",
    uri: "https://example.com/aptosvault",
  },
  {
    name: "AptosDEX",
    description: "Decentralized order book exchange",
    uri: "https://example.com/aptosdex",
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