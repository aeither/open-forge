import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMintProductNFT } from "@/hooks/useProductNFT"
import { getIrysUploader, uploadMetadataURI } from "@/utils/irys"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useState } from "react"

export function Irys() {
  const wallet = useWallet()
  const { connected } = useWallet()
  const [image, setImage] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [socialUrl, setSocialUrl] = useState("")
  const [externalUrl, setExternalUrl] = useState("")
  const [metadataUrl, setMetadataUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const mintProduct = useMintProductNFT()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !wallet || !image) return

    setIsUploading(true)
    try {
      const irysUploader = await getIrysUploader(wallet)

      const metadataUploadUrl = await uploadMetadataURI(
        irysUploader,
        image,
        name,
        description,
        externalUrl
      )
      setMetadataUrl(metadataUploadUrl)

      mintProduct.mutate({
        name,
        description,
        uri: metadataUploadUrl,
        longDescription,
        socialUrl,
      })
    } catch (error) {
      console.error("Error uploading:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <Header title="Submit Your Project" />
      <div className="flex items-center justify-center flex-col">
        <Card className="mt-6 w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {connected
                ? "Showcase Your Innovation"
                : "Connect your wallet to get started"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="image" className="block text-sm font-medium">
                  Project Image
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
                  Project Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your project name"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Tagline
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  placeholder="Describe your project in one sentence"
                />
              </div>
              <div>
                <label
                  htmlFor="longDescription"
                  className="block text-sm font-medium"
                >
                  Full Description
                </label>
                <Textarea
                  id="longDescription"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  className="mt-1"
                  placeholder="Tell us more about your project"
                />
              </div>
              <div>
                <label
                  htmlFor="socialUrl"
                  className="block text-sm font-medium"
                >
                  Social Media URL
                </label>
                <Input
                  id="socialUrl"
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://twitter.com/yourproject"
                />
              </div>
              <div>
                <label
                  htmlFor="externalUrl"
                  className="block text-sm font-medium"
                >
                  Project Website
                </label>
                <Input
                  id="externalUrl"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://yourproject.com"
                />
              </div>
              <Button type="submit" disabled={isUploading} className="w-full">
                {isUploading ? "Submitting..." : "Launch Your Project"}
              </Button>
            </form>
            {metadataUrl && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Project URL:</h2>
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
