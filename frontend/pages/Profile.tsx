// import { Header } from "@/components/Header"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useGetHolding, useGetIssuerObjectAddress } from "@/hooks/useHolding"
// import { useHasIssuedShare } from "@/hooks/useIssuer"
// import { ABI } from "@/utils/abi-aptos_friend"
// import { getAptosClient } from "@/utils/aptosClient"
// import { useWallet } from "@aptos-labs/wallet-adapter-react"
// import { useWalletClient } from "@thalalabs/surf/hooks"
// import type React from "react"
// import { useState } from "react"
// import { useParams } from "react-router-dom"
// import { toast } from "sonner"

// export const Profile: React.FC = () => {
//   const { connected, account } = useWallet()
//   const { client: walletClient } = useWalletClient()
//   const [amount, setAmount] = useState(0)
//   const [username, setUsername] = useState("")

//   const userAddress = connected && account ? account.address : null
//   const hasIssuedShare = useHasIssuedShare(userAddress as `0x${string}`)

//   const { issuerAddress } = useParams()
//   const isOwnProfile = userAddress === issuerAddress

//   const holding = useGetHolding(
//     userAddress as `0x${string}`,
//     userAddress as `0x${string}`
//   )
//   const issuerObjectAddress = useGetIssuerObjectAddress(
//     userAddress as `0x${string}`
//   )

//   const shortenAddress = (addr: string) => {
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`
//   }

//   const handleTrade = async (isBuying: boolean) => {
//     if (!walletClient || !issuerObjectAddress) return

//     let resp: any
//     if (isBuying) {
//       resp = await walletClient.useABI(ABI).buy_share({
//         type_arguments: [],
//         arguments: [issuerObjectAddress, amount],
//       })
//     } else {
//       resp = await walletClient.useABI(ABI).sell_share({
//         type_arguments: [],
//         arguments: [issuerObjectAddress, amount],
//       })
//     }

//     const executedTransaction = await getAptosClient().waitForTransaction({
//       transactionHash: resp.hash,
//     })

//     toast.success("Success", {
//       description: (
//         <a
//           href={`https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${import.meta.env.VITE_APP_NETWORK}`}
//         >
//           Share {isBuying ? "bought" : "sold"}, view on explorer
//         </a>
//       ),
//     })
//     setAmount(0)
//   }

//   const handleIssueShare = async () => {
//     if (!walletClient || !username) return

//     const resp = await walletClient.useABI(ABI).issue_share({
//       type_arguments: [],
//       arguments: [username],
//     })
//     const executedTransaction = await getAptosClient().waitForTransaction({
//       transactionHash: resp.hash,
//     })
//     toast.success("Success", {
//       description: (
//         <a
//           href={`https://explorer.aptoslabs.com/txn/${executedTransaction.hash}?network=${import.meta.env.VITE_APP_NETWORK}`}
//         >
//           Share issued, view on explorer
//         </a>
//       ),
//     })
//   }

//   return (
//     <>
//       <Header title={isOwnProfile ? "My Profile" : "User Profile"} />
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold text-center">
//               {connected ? "My Profile" : "Connect Wallet"}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {connected && account ? (
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <p className="text-sm text-gray-500">Address</p>
//                   <p className="font-mono">{shortenAddress(account.address)}</p>
//                 </div>
//                 {hasIssuedShare ? (
//                   <>
//                     <div className="text-center">
//                       <p className="text-sm text-gray-500">Your Shares</p>
//                       <p className="text-xl font-semibold">
//                         {holding?.shares || 0}
//                       </p>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="amount">Amount</Label>
//                       <Input
//                         id="amount"
//                         type="number"
//                         value={amount}
//                         onChange={(e) =>
//                           setAmount(Number.parseInt(e.target.value))
//                         }
//                         placeholder="Enter amount"
//                       />
//                     </div>
//                     <div className="flex justify-center space-x-4 mt-6">
//                       <Button
//                         variant="outline"
//                         onClick={() => handleTrade(true)}
//                       >
//                         Buy
//                       </Button>
//                       <Button
//                         variant="outline"
//                         onClick={() => handleTrade(false)}
//                       >
//                         Sell
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="space-y-2">
//                       <Label htmlFor="username">Username</Label>
//                       <Input
//                         id="username"
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         placeholder="Enter username"
//                       />
//                     </div>
//                     <Button className="w-full" onClick={handleIssueShare}>
//                       Issue Share
//                     </Button>
//                   </>
//                 )}
//               </div>
//             ) : (
//               <p className="text-center">
//                 Please connect your wallet to view your profile.
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </>
//   )
// }

// import { useWallet } from "@aptos-labs/wallet-adapter-react"
// import { useParams } from "react-router-dom"

// import { Header } from "@/components/Header"
// import { IssueShare } from "@/components/IssueShare"
// import { IssuerDetails } from "@/components/IssuerDetails"
// import { IssuerShareHolders } from "@/components/IssuerShareHolders"
// import { TradeShare } from "@/components/TradeShare"
// import { UserHoldings } from "@/components/UserHoldings"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useHasIssuedShare } from "@/hooks/useIssuer"

// export function Profile() {
//   const { issuerAddress } = useParams()
//   const { connected, account } = useWallet()
//   const userAddress = connected && account ? account.address : null
//   const hasIssuedShare = useHasIssuedShare(userAddress as `0x${string}`)

//   const isOwnProfile = userAddress === issuerAddress
//   const profileAddress = isOwnProfile ? userAddress : issuerAddress

//   return (
//     <>
//       <Header title={isOwnProfile ? "My Profile" : "User Profile"} />
//       <div className="flex items-center justify-center flex-col">
//         {connected && account ? (
//           <Card>
//             <CardContent className="flex flex-col gap-10 pt-6">
//               {isOwnProfile && !hasIssuedShare ? (
//                 <IssueShare />
//               ) : (
//                 <>
//                   <IssuerDetails
//                     issuerAddress={profileAddress as `0x${string}`}
//                   />
//                   <TradeShare issuerAddress={profileAddress as `0x${string}`} />
//                   <IssuerShareHolders
//                     issuerAddress={profileAddress as `0x${string}`}
//                   />
//                 </>
//               )}
//               <UserHoldings userAddress={profileAddress as `0x${string}`} />
//             </CardContent>
//           </Card>
//         ) : (
//           <CardHeader>
//             <CardTitle>Connect a wallet to see the profile</CardTitle>
//           </CardHeader>
//         )}
//       </div>
//     </>
//   )
// }
