import { Progress } from "@/components/ui/progress"
import { useKeylessAccount } from "@/context/KeylessAccountContext"
import { getLocalEphemeralKeyPair } from "@/hooks/useEphemeralKeyPair"
import { getAptosClient } from "@/utils/aptosClient"
import type { EphemeralKeyPair } from "@aptos-labs/ts-sdk"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const parseJWTFromURL = (url: string): string | null => {
  const urlObject = new URL(url)
  const fragment = urlObject.hash.substring(1)
  const params = new URLSearchParams(fragment)
  return params.get("id_token")
}

function CallbackPage() {
  const { setKeylessAccount } = useKeylessAccount()
  const navigate = useNavigate()

  const [progress, setProgress] = useState<number>(0)
  const [hasError, setHasError] = useState<boolean>(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return currentProgress + 1
      })
    }, 50)

    async function deriveAccount() {
      const jwt = parseJWTFromURL(window.location.href)

      if (!jwt) {
        setHasError(true)
        setProgress(100)
        toast.error("No JWT found in URL. Please try logging in again.")
        return
      }

      const payload = jwtDecode<{ nonce: string }>(jwt)

      const jwtNonce = payload.nonce

      const ephemeralKeyPair = getLocalEphemeralKeyPair(jwtNonce)

      if (!ephemeralKeyPair) {
        setHasError(true)
        setProgress(100)
        toast.error(
          "No ephemeral key pair found for the given nonce. Please try logging in again."
        )
        return
      }

      await createKeylessAccount(jwt, ephemeralKeyPair)
      clearInterval(interval)
      setProgress(100)
      navigate("/")
    }

    deriveAccount()
  }, [])

  const createKeylessAccount = async (
    jwt: string,
    ephemeralKeyPair: EphemeralKeyPair
  ) => {
    const aptosClient = getAptosClient()
    const keylessAccount = await aptosClient.deriveKeylessAccount({
      jwt,
      ephemeralKeyPair,
    })

    const accountCoinsData = await aptosClient.getAccountCoinsData({
      accountAddress: keylessAccount?.accountAddress.toString(),
    })
    // account does not exist yet -> fund it
    if (accountCoinsData.length === 0) {
      try {
        await aptosClient.fundAccount({
          accountAddress: keylessAccount.accountAddress,
          amount: 200000000, // faucet 2 APT to create the account
        })
      } catch (error) {
        console.log("Error funding account: ", error)
        toast.error(
          "Failed to fund account. Please try logging in again or use another account."
        )
      }
    }

    console.log("Keyless Account: ", keylessAccount.accountAddress.toString())
    setKeylessAccount(keylessAccount)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          Loading your account
        </h1>
        <Progress
          value={progress}
          className="w-full mb-4"
          indicatorClassName={hasError ? "bg-red-500" : "bg-blue-500"}
        />
        <p className="text-center text-gray-600">
          {hasError
            ? "An error occurred. Please try again."
            : `${progress}% complete`}
        </p>
        {progress === 100 && !hasError && (
          <p className="text-center text-green-600 mt-4">
            Redirecting...
          </p>
        )}
      </div>
    </div>
  )
}

export default CallbackPage
