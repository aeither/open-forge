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
    description:
      "Build lasting habits with this gamified habit tracker powered by Aptos",
    image: "",
    name: "HabitSphere",
    external_url: "https://habitsphere.app",
    social_url: "https://twitter.com/HabitSphere",
    long_description:
      "HabitSphere is a revolutionary habit-building app that leverages blockchain technology to gamify personal growth. Users can set goals, track progress, and earn rewards for consistency. With its intuitive interface and social features, HabitSphere makes forming lasting habits fun and engaging.",
    github_url: "https://github.com/HabitSphere/app",
    uri: "https://gateway.irys.xyz/CSydToTXyWDtg1AHrtnz2p2yRBgzumncDeZNgqTZwX9A",
  },
  {
    description:
      "Challenge friends and track your fitness streaks on the blockchain",
    image: "",
    name: "FitStreak",
    external_url: "https://fitstreak.io",
    social_url: "https://twitter.com/FitStreak_app",
    long_description:
      "FitStreak is a fitness tracking app that uses blockchain to verify and reward workout consistency. Users can challenge friends, join fitness communities, and earn tokens for maintaining their exercise routines. With integration to popular fitness devices, FitStreak makes staying healthy a social and rewarding experience.",
    github_url: "https://github.com/FitStreak/mobile-app",
    uri: "https://gateway.irys.xyz/37U2WhoDvy29RneeGT53axp84tZUiq4engV4Y3BzJzWC",
  },
  {
    description:
      "Decentralized prediction market for sports, entertainment, and global events",
    image: "",
    name: "CryptoOracle",
    external_url: "https://cryptooracle.xyz",
    social_url: "https://twitter.com/CryptoOracle_",
    long_description:
      "CryptoOracle is a decentralized prediction market platform where users can create and participate in markets for sports outcomes, entertainment awards, and global events. Leveraging blockchain for transparency and fairness, CryptoOracle offers a unique way to engage with current events and test your forecasting skills.",
    github_url: "https://github.com/CryptoOracle/platform",
    uri: "https://gateway.irys.xyz/J7N1idNEEg5LWr6z2y9e3Ukg9uZR6znzJqboNi7A1y74",
  },
  {
    description:
      "Fast and eco-friendly payment solution for everyday transactions",
    image: "",
    name: "AptosEcoPay",
    external_url: "https://aptosecopay.com",
    social_url: "https://twitter.com/AptosEcoPay",
    long_description:
      "AptosEcoPay is a cutting-edge payment solution built on the Aptos blockchain, offering lightning-fast transactions with minimal environmental impact. It supports both online and in-store payments, loyalty programs, and cross-border transfers, making it ideal for businesses and consumers alike.",
    github_url: "https://github.com/AptosEcoPay/core",
    uri: "https://gateway.irys.xyz/DXSkEfjwYvrwNimdpFFX5RsqX986VCJuGNfVi3gkm35M",
  },
  {
    description: "Secure personal health data management and sharing platform",
    image: "",
    name: "HealthLink",
    external_url: "https://healthlink.health",
    social_url: "https://twitter.com/HealthLink_app",
    long_description:
      "HealthLink is a blockchain-based platform that empowers individuals to securely store, manage, and share their health data. With features like encrypted storage, granular access controls, and integration with healthcare providers, HealthLink puts users in control of their medical information while facilitating better healthcare outcomes.",
    github_url: "https://github.com/HealthLink/secure-platform",
    uri: "https://gateway.irys.xyz/cPuhQwzXVWBZBfSutPeseLQPs76qK88FWLWDY8R275M",
  },
  {
    description:
      "Gamified learning platform with blockchain-verified credentials",
    image: "",
    name: "EduQuest",
    external_url: "https://eduquest.learn",
    social_url: "https://twitter.com/EduQuest_learn",
    long_description:
      "EduQuest transforms online learning through gamification and blockchain-verified credentials. Learners can embark on educational journeys, complete quests, and earn verifiable certificates. With a wide range of courses and interactive content, EduQuest makes continuous learning engaging and rewarding.",
    github_url: "https://github.com/EduQuest/learning-platform",
    uri: "https://gateway.irys.xyz/BCGYPhtiy6x8Dt34T6Ct1cmmvSc7M1vwUK1kevPyPU2s",
  },
  {
    description:
      "Earn rewards for sustainable lifestyle choices and carbon reduction",
    image: "",
    name: "GreenCred",
    external_url: "https://greencred.eco",
    social_url: "https://twitter.com/GreenCred_eco",
    long_description:
      "GreenCred incentivizes sustainable living by rewarding users for eco-friendly choices. From using public transport to reducing energy consumption, users earn tokens for verifiable green actions. These tokens can be exchanged for eco-products or used to offset carbon footprints, creating a positive cycle of sustainability.",
    github_url: "https://github.com/GreenCred/sustainability-app",
    uri: "https://gateway.irys.xyz/BrLRsf6Z3eDcPmxDxQNooCWQX9DbAUn3ZvXYzCS8xVjy",
  },
  {
    description:
      "Engage in community polls and decision-making with full transparency",
    image: "",
    name: "VoxPoll",
    external_url: "https://voxpoll.vote",
    social_url: "https://twitter.com/VoxPoll_vote",
    long_description:
      "VoxPoll is a decentralized voting platform that enables communities, organizations, and governments to conduct transparent and tamper-proof polls and elections. With features like identity verification, real-time results, and audit trails, VoxPoll ensures that every voice is heard and every vote counts.",
    github_url: "https://github.com/VoxPoll/voting-system",
    uri: "https://gateway.irys.xyz/DEJ2nLthSnZg79d8qM3dbSQ7T6dvWx4QpDL6oMJ4G5D5",
  },
  {
    description:
      "Transparent donation platform connecting donors directly with causes",
    image: "",
    name: "DonorHub",
    external_url: "https://donorhub.org",
    social_url: "https://twitter.com/DonorHub_org",
    long_description:
      "DonorHub revolutionizes charitable giving by creating a direct, transparent link between donors and causes. Using blockchain technology, donors can track their contributions and see the real-world impact of their generosity. DonorHub supports a wide range of causes and provides detailed reporting to ensure accountability.",
    github_url: "https://github.com/DonorHub/donation-platform",
    uri: "https://gateway.irys.xyz/CSH2pKa5m5xRGpCYJTtKUtXgeY6X71iuAKNcN2roXa9v",
  },
  {
    description:
      "Crowdfunding platform for scientific research with progress tracking",
    image: "",
    name: "ScienceBoost",
    external_url: "https://scienceboost.fund",
    social_url: "https://twitter.com/ScienceBoost",
    long_description:
      "ScienceBoost is a crowdfunding platform dedicated to advancing scientific research. It allows researchers to present their projects, seek funding, and provide regular updates to backers. With features like milestone tracking and peer review integration, ScienceBoost makes supporting and following cutting-edge research accessible to everyone.",
    github_url: "https://github.com/ScienceBoost/crowdfunding-platform",
    uri: "https://gateway.irys.xyz/2tsCi7jk6Q3RyywxEEfB4NskanEniDYDHufymr37kz9b",
  },
  {
    description:
      "Secure and user-friendly digital identity management for everyone",
    image: "",
    name: "IdentityGuard",
    external_url: "https://identityguard.id",
    social_url: "https://twitter.com/IdentityGuard_",
    long_description:
      "IdentityGuard provides a secure, blockchain-based solution for managing digital identities. Users can create, store, and control their personal information, choosing what to share and with whom. With features like multi-factor authentication and privacy-preserving verification, IdentityGuard offers a new standard in online identity protection.",
    github_url: "https://github.com/IdentityGuard/identity-management",
    uri: "https://gateway.irys.xyz/CSydToTXyWDtg1AHrtnz2p2yRBgzumncDeZNgqTZwX9A",
  },
  {
    description:
      "Quick and easy microloans for personal and small business needs",
    image: "",
    name: "MicroBoost",
    external_url: "https://microboost.finance",
    social_url: "https://twitter.com/MicroBoost_fin",
    long_description:
      "MicroBoost is a decentralized finance platform offering quick, accessible microloans to individuals and small businesses. By leveraging blockchain technology, MicroBoost reduces overhead costs and streamlines the lending process, making it possible to offer competitive rates and rapid approvals for those who need financial support the most.",
    github_url: "https://github.com/MicroBoost/defi-lending",
    uri: "https://gateway.irys.xyz/37U2WhoDvy29RneeGT53axp84tZUiq4engV4Y3BzJzWC",
  },
  {
    description:
      "Direct-to-fan platform for content creators to monetize their work",
    image: "",
    name: "CreatorConnect",
    external_url: "https://creatorconnect.io",
    social_url: "https://twitter.com/CreatorConnect",
    long_description:
      "CreatorConnect empowers content creators by providing a direct-to-fan monetization platform. Creators can offer exclusive content, digital goods, and experiences to their supporters, with blockchain ensuring transparent and fair revenue distribution. From artists to educators, CreatorConnect helps turn passion into sustainable income.",
    github_url: "https://github.com/CreatorConnect/creator-platform",
    uri: "https://gateway.irys.xyz/J7N1idNEEg5LWr6z2y9e3Ukg9uZR6znzJqboNi7A1y74",
  },
  {
    description:
      "Marketplace for eco-friendly products with blockchain-verified sustainability",
    image: "",
    name: "EcoShop",
    external_url: "https://ecoshop.market",
    social_url: "https://twitter.com/EcoShop_market",
    long_description:
      "EcoShop is a revolutionary marketplace for eco-friendly and sustainable products. Each item's environmental impact and ethical sourcing are verified and recorded on the blockchain, providing consumers with unprecedented transparency. From fashion to home goods, EcoShop makes it easy to shop consciously and support sustainable businesses.",
    github_url: "https://github.com/EcoShop/green-marketplace",
    uri: "https://gateway.irys.xyz/DXSkEfjwYvrwNimdpFFX5RsqX986VCJuGNfVi3gkm35M",
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
      product.uri,
      product.long_description,
      product.social_url
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
  uri: string,
  longDescription: string,
  socialUrl: string
) => {
  const result = await surfProductNFT.entry.mint_product({
    functionArguments: [name, description, uri, longDescription, socialUrl],
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
