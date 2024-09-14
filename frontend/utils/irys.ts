import type { WalletContextState } from "@aptos-labs/wallet-adapter-react";
import { WebUploader } from "@irys/web-upload";
import { WebAptos } from "@irys/web-upload-aptos";

let irysUploaderInstance: any | null = null;

export async function getIrysUploader(
  wallet: WalletContextState
): Promise<any> {
  if (!irysUploaderInstance) {
    const rpcURL = "https://fullnode.testnet.aptoslabs.com"
    irysUploaderInstance = await WebUploader(WebAptos)
      .withProvider(wallet)
      .withRpc(rpcURL)
      .devnet()
  }
  return irysUploaderInstance;
}

export async function getMetadataURI(
  irysUploader: any,
  image: File,
  name: string,
  description: string,
  externalUrl: string
): Promise<string> {
  // Upload image
  const imageReceipt = await irysUploader.uploadFile(image)
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
  const metadataReceipt = await irysUploader.uploadFile(metadataFile)
  return `https://gateway.irys.xyz/${metadataReceipt.id}`
}
