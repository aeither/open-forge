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
      // Write ABI to utils/abi-{MODULENAME}.ts
      const abi = response.data.abi
      const abiString = `export const ABI = ${JSON.stringify(abi)} as const;`
      fs.writeFileSync(`frontend/utils/abi-${moduleName}.ts`, abiString)
      console.log(`ABI saved to frontend/utils/abi-${moduleName}.ts`)

      // Write Module Address to Constants.ts
      const uppercaseModuleName = moduleName.toUpperCase()
      const filePath = "frontend/lib/constants.ts"
      let constFolderContent = ""

      if (fs.existsSync(filePath)) {
        constFolderContent = fs.readFileSync(filePath, "utf8")
      }

      const regex = new RegExp(
        `^export const ${uppercaseModuleName}_ADDR = .*$`,
        "m"
      )
      const newEntry = `export const ${uppercaseModuleName}_ADDR = ${JSON.stringify(abi.address)}`

      if (constFolderContent.match(regex)) {
        constFolderContent = constFolderContent.replace(regex, newEntry)
      } else {
        constFolderContent += `\n${newEntry}`
      }
      fs.writeFileSync(filePath, constFolderContent)
      console.log("addr saved to frontend/lib/constants.ts")
    })
    .catch((error) => {
      console.error("Error fetching ABI:", error)
    })
}

getAbi(MODULE_NAME)
getAbi(MODULE_NAME_2)
