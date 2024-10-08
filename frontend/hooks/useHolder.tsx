import { useEffect, useState } from "react"

import type { Holding } from "@/utils/types"
import { surfClientBuilderShare } from "@/utils/aptosClient"

export function useGetHolders(issuerAddress?: string) {
  const [holdings, setHoldings] = useState<Holding[]>()

  useEffect(() => {
    if (!issuerAddress) {
      return
    }
    getIssuerObject(issuerAddress as `0x${string}`).then((issuerObject) => {
      getHoldingObjects(issuerObject).then((holdingObjects) => {
        getHoldings(holdingObjects).then((result) => {
          setHoldings(result)
        })
      })
    })
  }, [issuerAddress])

  return holdings
}

const getIssuerObject = async (issuerAddress: `0x${string}`) => {
  return (
    await surfClientBuilderShare().view.get_issuer_obj({
      typeArguments: [],
      functionArguments: [issuerAddress],
    })
  )[0] as { inner: `0x${string}` }
}

const getHoldingObjects = async (issuerObject: { inner: `0x${string}` }) => {
  return (
    await surfClientBuilderShare().view.get_issuer_holder_holdings({
      typeArguments: [],
      functionArguments: [issuerObject.inner],
    })
  )[0] as { inner: `0x${string}` }[]
}

const getHoldings = async (holdingObjects: { inner: `0x${string}` }[]) => {
  return await Promise.all(
    holdingObjects.map(async (holdingObject: { inner: `0x${string}` }) =>
      surfClientBuilderShare()
        .view.get_holding({
          typeArguments: [],
          functionArguments: [holdingObject.inner],
        })
        .then((holding) => {
          return {
            issuer: holding[0],
            holder: holding[1],
            shares: Number.parseInt(holding[2]),
          }
        })
    )
  )
}
