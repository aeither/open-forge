import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk"
import { createSurfClient } from "@thalalabs/surf"

import { NETWORK } from "@/lib/constants"
import { ABI } from "@/utils/abi-aptos_friend"
import { ABI as ABI_PRODUCT_NFT } from "@/utils/abi-product_nft"

const aptos = new Aptos(
  new AptosConfig({
    network: NETWORK,
    fullnode: `https://aptos-testnet.nodit.io/${process.env.NODIT_API_KEY}/v1`,
    indexer: `https://aptos-testnet.nodit.io/${process.env.NODIT_API_KEY}/v1/graphql`,
    faucet: "https://faucet.testnet.aptoslabs.com",
  })
)
const surf = createSurfClient(aptos)

// Reuse same Aptos instance to utilize cookie based sticky routing
export function getAptosClient() {
  return aptos
}

export function getSurfClient() {
  return surf
}

export function surfClientBuilderShare() {
  return surf.useABI(ABI)
}

export function surfClientProductNFT() {
  return surf.useABI(ABI_PRODUCT_NFT)
}
