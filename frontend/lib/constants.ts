// * Update Collection Name on Contract Redeployment

import type { Network } from "@aptos-labs/wallet-adapter-react"

export const NETWORK: Network = import.meta.env.VITE_APP_NETWORK ?? "testnet"

export const PRODUCT_NFT_ADDR =
  "0x3937fa049f5d8ec5ea9e17b042788f20110b99741ee2c13c1255f0b066f92d67"
export const APTOS_FRIEND_ADDR =
  "0x3937fa049f5d8ec5ea9e17b042788f20110b99741ee2c13c1255f0b066f92d67"
export const COLLECTION_NAME = "Open Forge - 8c68bc"
