import { EphemeralKeyPair } from "@aptos-labs/ts-sdk"

const main = async () => {
  const ephemeralKeyPair = EphemeralKeyPair.generate()
  console.log("🚀 ~ ephemeralKeyPair:", ephemeralKeyPair.getPublicKey().publicKey.toString())

//   Account Derivation
//   const keylessAccount = await aptos.deriveKeylessAccount({
//     jwt,
//     ephemeralKeyPair,
//   })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
