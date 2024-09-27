// components/Play.tsx

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetIssuerObjectAddress } from "@/hooks/useHolding"
import { useRandomProductWithNFT } from "@/hooks/useRandomProduct"
import { useTradeShare } from "@/hooks/useShares"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import type React from "react"
import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

const Play: React.FC = () => {
  const {
    setAndGetRandomProject,
    getProjectById,
    matchingNFT,
    isLoading,
    error,
  } = useRandomProductWithNFT()
  const [searchParams, setSearchParams] = useSearchParams()
  const { connected, account } = useWallet()
  const tradeShareMutation = useTradeShare()
  const issuerObjectAddress = useGetIssuerObjectAddress(
    matchingNFT?.current_token_ownerships[0]?.owner_address as `0x${string}`
  )

  useEffect(() => {
    const productId = searchParams.get("product-id")
    if (productId) {
      getProjectById(productId)
    }
  }, [searchParams, getProjectById])

  const handleStart = async () => {
    const randomId = await setAndGetRandomProject()
    if (randomId) {
      setSearchParams({ "product-id": randomId.toString() })
    }
  }

  const handlePass = async () => {
    const randomId = await setAndGetRandomProject()
    if (randomId) {
      setSearchParams({ "product-id": randomId.toString() })
    }
  }

  const handleFund = async () => {
    if (!connected || !account) {
      toast.error("Please connect your wallet to fund this project.")
      return
    }

    if (!issuerObjectAddress) {
      toast.error("Unable to get issuer object address. Please try again.")
      return
    }

    try {
      await tradeShareMutation.mutateAsync({
        issuerObjectAddress,
        isBuying: true,
      })
      toast.success(`Successfully funded project: ${matchingNFT?.token_name}`)
    } catch (error) {
      console.error("Error funding project:", error)
      toast.error("Failed to fund the project. Please try again.")
    }
  }

  if (!searchParams.get("product-id")) {
    return (
      <>
        <Header title={"Open Forge"} />
        <main className="flex-1 bg-background flex min-h-[calc(100vh-74px)] items-center justify-center">
          <Button size="lg" onClick={handleStart} className="text-xl px-8 py-4">
            Start Exploring Projects
          </Button>
        </main>
      </>
    )
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header title={"Open Forge"} />
      <main className="flex-1 bg-background">
        <section className="container mx-auto my-8 sm:my-12 max-w-4xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <LoadingProjectCard />
          ) : error ? (
            <ErrorCard message={error.message} />
          ) : !matchingNFT ? (
            <ErrorCard message="No matching project found" />
          ) : (
            <ProjectCard
              id={matchingNFT.token_data_id}
              name={matchingNFT.token_name}
              description={matchingNFT.description}
              imageUrl={matchingNFT.image || ""}
              category={matchingNFT.token_properties["Product Status"]}
              onPass={handlePass}
              onFund={handleFund}
            />
          )}
        </section>
      </main>
    </div>
  )
}

interface ProjectCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
  category: string
  onPass: () => void
  onFund: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  imageUrl,
  category,
  onPass,
  onFund,
}) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={`/project/${id}`}>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="mt-2">
            <span className="inline-block bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm font-semibold mr-2">
              {category}
            </span>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between w-full p-0">
        <Button
          variant="secondary"
          size="lg"
          className="w-1/2 rounded-none h-16 text-lg font-semibold"
          onClick={onPass}
        >
          Pass
        </Button>
        <Button
          variant="default"
          size="lg"
          className="w-1/2 rounded-none h-16 text-lg font-semibold"
          onClick={onFund}
        >
          Fund
        </Button>
      </CardFooter>
    </Card>
  )
}

const LoadingProjectCard: React.FC = () => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-64 rounded-md" />
        <div className="mt-2">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between w-full p-0">
        <Skeleton className="w-1/2 h-16" />
        <Skeleton className="w-1/2 h-16" />
      </CardFooter>
    </Card>
  )
}

const ErrorCard: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-red-500">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{message}</p>
      </CardContent>
    </Card>
  )
}

export default Play