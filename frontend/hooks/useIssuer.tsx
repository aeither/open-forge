import { useEffect, useState } from "react"

import { surfClientBuilderShare } from "@/utils/aptosClient"
import type { Issuer } from "@/utils/types"
import { useQuery } from "@tanstack/react-query"

// This call can be pretty expensive when fetching a big number of assets,
// therefore it is not recommended to use it in production
export function useGetIssuers() {
  const [issuers, setIssuers] = useState<Issuer[]>([])

  useEffect(() => {
    getRegistry().then((issuerObjects) => {
      getIssuers(issuerObjects).then((issuers) => {
        setIssuers(issuers)
      })
    })
  }, [])

  return issuers
}

export function useGetIssuer(issuerAddress?: string) {
  return useQuery<Issuer | undefined>({
    queryKey: ["issuer", issuerAddress],
    queryFn: async () => {
      if (!issuerAddress) {
        return undefined
      }
      const issuerObject = await getIssuerObject(issuerAddress as `0x${string}`)
      return getIssuer(issuerObject)
    },
    enabled: !!issuerAddress,
  })
}

export function useHasIssuedShare(issuerAddress?: string) {
  const [hasIssuedShare, setHasIssuedShare] = useState<boolean>(false)

  useEffect(() => {
    if (!issuerAddress) {
      return
    }
    surfClientBuilderShare()
      .view.has_issued_share({
        typeArguments: [],
        functionArguments: [issuerAddress as `0x${string}`],
      })
      .then((result) => {
        setHasIssuedShare(result[0])
      })
  }, [issuerAddress])

  return hasIssuedShare
}

const getRegistry = async () => {
  return (
    await surfClientBuilderShare().view.get_issuer_registry({
      typeArguments: [],
      functionArguments: [],
    })
  )[0] as [{ inner: `0x${string}` }]
}

const getIssuerObject = async (issuerAddress: `0x${string}`) => {
  return (
    await surfClientBuilderShare().view.get_issuer_obj({
      typeArguments: [],
      functionArguments: [issuerAddress],
    })
  )[0] as { inner: `0x${string}` }
}

const getIssuer = async (issuerObject: { inner: `0x${string}` }) => {
  return await surfClientBuilderShare()
    .view.get_issuer({
      typeArguments: [],
      functionArguments: [issuerObject.inner],
    })
    .then((issuer) => {
      return {
        issuerObjectAddress: issuerObject.inner,
        issuerAddress: issuer[0],
        username: issuer[1],
        totalIssuedShares: Number.parseInt(issuer[2]),
      }
    })
}

const getIssuers = async (issuerObjects: [{ inner: `0x${string}` }]) => {
  return await Promise.all(
    issuerObjects.map((issuerObject: { inner: `0x${string}` }) =>
      getIssuer(issuerObject)
    )
  )
}
