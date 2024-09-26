// * Update Collection Name on Contract Redeployment

import type { Network } from "@aptos-labs/wallet-adapter-react"

export const NETWORK: Network = import.meta.env.VITE_APP_NETWORK ?? "testnet"

export const PRODUCT_NFT_ADDR = "0x8726333d21a047d2ec29f7060d84721696b69de63e787ceac7e0a76eecf22742"
export const APTOS_FRIEND_ADDR = "0x8726333d21a047d2ec29f7060d84721696b69de63e787ceac7e0a76eecf22742"
export const COLLECTION_NAME = "Open Forge - 258fdb"