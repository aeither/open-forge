require("dotenv").config()
const axios = require("axios")
const fs = require("node:fs")

const MODULE_NAME = "aptos_friend"
const MODULE_NAME_2 = "product_nft"

async function getAbi(moduleName) {
  const url = `https://fullnode.${process.env.VITE_APP_NETWORK}.aptoslabs.com/v1/accounts/${process.env.VITE_MODULE_ADDRESS}/module/${moduleName}`
  axios
    .get(url)
    .then((response) => {
      const abi = response.data.abi
      const abiString = `export const ABI = ${JSON.stringify(abi)} as const;`
      fs.writeFileSync(`frontend/utils/abi-${moduleName}.ts`, abiString)
      console.log(`ABI saved to frontend/utils/abi-${moduleName}.ts`)
    })
    .catch((error) => {
      console.error("Error fetching ABI:", error)
    })
}

getAbi(MODULE_NAME)
getAbi(MODULE_NAME_2)
