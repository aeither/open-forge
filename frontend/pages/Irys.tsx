import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { WebUploader } from "@irys/web-upload"
import { WebAptos } from "@irys/web-upload-aptos"
import { useRef, useState } from "react"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const shortenAddress = (address: string) => {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function Irys() {
  const { connected } = useWallet()
  const wallet = useWallet()
  const [irysStatus, setIrysStatus] = useState("Not connected")
  const [image, setImage] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [externalUrl, setExternalUrl] = useState("")
  const [metadataUrl, setMetadataUrl] = useState("")
  const irysUploaderRef = useRef<WebUploader | null>(null)

  const connectIrys = async () => {
    try {
      const rpcURL = "https://fullnode.testnet.aptoslabs.com"
      const irysUploader = await WebUploader(WebAptos)
        .withProvider(wallet)
        .withRpc(rpcURL)
        .devnet()
      irysUploaderRef.current = irysUploader

      setIrysStatus(`Connected to Irys: ${shortenAddress(irysUploader.address)}`)
    } catch (error) {
      console.error("Error connecting to Irys:", error)
      setIrysStatus("Error connecting to Irys")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image || !irysUploaderRef.current) return

    try {
      // Upload image
      const imageReceipt = await irysUploaderRef.current.uploadFile(image)
      const imageUrl = `https://gateway.irys.xyz/${imageReceipt.id}`

      // Create metadata
      const metadata = {
        name,
        description,
        image: imageUrl,
        external_url: externalUrl,
      }

      // Create a Blob from the metadata
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      })

      // Create a File from the Blob
      const metadataFile = new File([metadataBlob], "metadata.json", {
        type: "application/json",
      })

      // Upload metadata
      const metadataReceipt =
        await irysUploaderRef.current.uploadFile(metadataFile)
      const metadataUploadUrl = `https://gateway.irys.xyz/${metadataReceipt.id}`

      setMetadataUrl(metadataUploadUrl)
    } catch (error) {
      console.error("Error uploading:", error)
    }
  }

  return (
    <>
      <Header title="Irys Upload" />
      <div className="flex items-center justify-center flex-col">
        <Card className="mt-6 w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {connected ? (
                <Button
                  onClick={connectIrys}
                  disabled={irysStatus !== "Not connected"}
                >
                  {irysStatus === "Not connected" ? "Connect Irys" : irysStatus}
                </Button>
              ) : (
                "To get started, connect a wallet"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="image" className="block text-sm font-medium">
                  Upload Image
                </label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="externalUrl"
                  className="block text-sm font-medium"
                >
                  External URL
                </label>
                <Input
                  id="externalUrl"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={!irysUploaderRef.current}>
                Upload
              </Button>
            </form>
            {metadataUrl && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Metadata URL:</h2>
                <a
                  href={metadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {metadataUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
