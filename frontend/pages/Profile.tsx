import { Header } from "@/components/Header"
import { LabelValueGrid } from "@/components/LabelValueGrid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCollectionNFTsByOwner } from "@/hooks/useCollectionNFTs"
import { useGetHolding, useGetIssuerObjectAddress } from "@/hooks/useHolding"
import { useGetIssuer, useHasIssuedShare } from "@/hooks/useIssuer"
import { useIssueShare, useTradeShare } from "@/hooks/useShares"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import type React from "react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"

export const Profile: React.FC = () => {
  const { connected, account } = useWallet()
  const [newUsername, setNewUsername] = useState("")
  const { issuerAddress } = useParams()
  const userAddress = connected && account ? account.address : null
  const isOwnProfile = userAddress === issuerAddress
  const profileAddress = isOwnProfile ? userAddress : issuerAddress
  const hasIssuedShare = useHasIssuedShare(issuerAddress as `0x${string}`)
  const { data: issuer } = useGetIssuer(profileAddress as `0x${string}`)
  const { data: holding } = useGetHolding(
    profileAddress as `0x${string}`,
    userAddress as `0x${string}`
  )
  const issuerObjectAddress = useGetIssuerObjectAddress(
    profileAddress as `0x${string}`
  )
  const tradeShareMutation = useTradeShare()
  const issueShareMutation = useIssueShare()

  const { loading, error, nftsWithMetadata } = useCollectionNFTsByOwner(
    issuerAddress as string
  )

  const handleTrade = async (isBuying: boolean) => {
    if (!issuerObjectAddress) return
    tradeShareMutation.mutate({ issuerObjectAddress, isBuying })
  }

  const handleIssueShare = async () => {
    if (!newUsername) return
    issueShareMutation.mutate({ username: newUsername })
  }

  return (
    <>
      <Header title={isOwnProfile ? "My Profile" : "User Profile"} />
      <div className="min-h-[calc(100vh-74px)] flex flex-col items-center justify-center p-4 gap-4">
        <Card className="w-full max-w-md bg-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {connected ? issuer?.username || "Profile" : "Connect Wallet"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connected && account ? (
              <div className="space-y-4">
                {issuer ? (
                  <LabelValueGrid
                    items={[
                      {
                        label: "Username",
                        value: <p>{issuer.username}</p>,
                      },
                      {
                        label: "Address",
                        value: (
                          <a
                            href={`https://explorer.aptoslabs.com/account/${issuer.issuerAddress}?network=${import.meta.env.VITE_APP_NETWORK}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 dark:text-blue-300"
                          >
                            {issuer.issuerAddress}
                          </a>
                        ),
                      },
                      {
                        label: "Total Issued Shares",
                        value: <p>{issuer.totalIssuedShares}</p>,
                      },
                      {
                        label: "Your Shares",
                        value: <p>{holding?.shares || 0}</p>,
                      },
                    ]}
                  />
                ) : (
                  <p>Loading issuer details...</p>
                )}
                {isOwnProfile && !hasIssuedShare ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter username"
                      />
                    </div>
                    <Button className="w-full" onClick={handleIssueShare}>
                      Issue Share
                    </Button>
                  </>
                ) : hasIssuedShare ? (
                  <div className="flex justify-center space-x-4 mt-6">
                    <Button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4"
                      onClick={() => handleTrade(true)}
                    >
                      Buy Share
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4"
                      onClick={() => handleTrade(false)}
                    >
                      Sell Share
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-center">
                Please connect your wallet to view this profile.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading Projects...</p>
            ) : error ? (
              <p>Error loading Projects: {error.message}</p>
            ) : (
              <div className="w-full">
                {nftsWithMetadata.map((project) => (
                  <Link
                    key={project.token_data_id}
                    to={`/project/${project.token_data_id}`}
                  >
                    <div className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition duration-300">
                      <img
                        src={project.image}
                        alt={project.token_name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{project.token_name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}