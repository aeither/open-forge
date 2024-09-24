import {
    Account,
    Aptos,
    AptosConfig,
    Ed25519PrivateKey,
    Network,
    NetworkToNetworkName,
    type PendingTransactionResponse
} from "@aptos-labs/ts-sdk"
import dotenv from "dotenv"
dotenv.config()

const APTOS_NETWORK: Network =
  NetworkToNetworkName[process.env.VITE_APP_NETWORK ?? Network.TESTNET]

const config = new AptosConfig({ network: APTOS_NETWORK })
const aptos = new Aptos(config)

if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY not found")

const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY)
const user = Account.fromPrivateKey({
  privateKey: privateKey,
})

const randomString = () => Math.random().toString().slice(2, 10)

const main = async () => {
  // Register a new domain
  const domainName = `${randomString()}.apt`
  console.log(`Registering domain: ${domainName}`)

  let pendingTxn: PendingTransactionResponse

  try {
    const transaction = await aptos.registerName({
      sender: user,
      name: domainName,
      expiration: { policy: "domain" },
    })

    pendingTxn = await aptos.signAndSubmitTransaction({
      signer: user,
      transaction,
    })

    await aptos.waitForTransaction({ transactionHash: pendingTxn.hash })
    console.log(`Domain registered successfully: ${domainName}`)
  } catch (error) {
    console.error("Error registering domain:", error)
    return
  }

  // Read the registered domain
  try {
    const nameFromIndexer = await aptos.getName({ name: domainName })
    if (nameFromIndexer) {
      console.log("Domain information:")
      console.log("Owner address:", nameFromIndexer.owner_address)
      console.log(
        "Expiration date:",
        new Date(nameFromIndexer.expiration_timestamp)
      )
      console.log("Registered address:", nameFromIndexer.registered_address)
      console.log("Target domain:", nameFromIndexer.domain)
    } else {
      console.log("Domain not found in indexer")
    }
  } catch (error) {
    console.error("Error reading domain information:", error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
