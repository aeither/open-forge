import { useKeylessAccount } from "@/context/KeylessAccountContext"
import useEphemeralKeyPair from "@/hooks/useEphemeralKeyPair"
import { collapseAddress } from "@/utils/address"
import { toast } from "sonner"
import GoogleLogo from "../GoogleLogo"
import { Button } from "../ui/button"

export default function KeylessButton() {
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID is not set in env")
  }

  const { keylessAccount, setKeylessAccount } = useKeylessAccount()
  const ephemeralKeyPair = useEphemeralKeyPair()

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  const searchParams = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri:
      typeof window !== "undefined"
        ? `${window.location.origin}/callback`
        : `${
            import.meta.env.DEV
              ? "http://localhost:3000"
              : import.meta.env.VITE_VERCEL_URL
          }/callback`,
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  })
  redirectUrl.search = searchParams.toString()

  const disconnect = () => {
    setKeylessAccount(null)
    toast.success("Successfully disconnected account")
  }

  if (keylessAccount) {
    return (
      <div className="flex items-center justify-center m-auto sm:m-0 sm:px-4">
        <button type="button" onClick={disconnect} title="Disconnect Wallet">
          <GoogleLogo />
          <span title={keylessAccount.accountAddress.toString()}>
            {collapseAddress(keylessAccount.accountAddress.toString())}
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center m-auto">
      <a href={redirectUrl.toString()} className="hover:no-underline">
        <Button size="sm" variant="default">
          Connect
        </Button>
      </a>
    </div>
  )
}
