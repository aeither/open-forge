import { LabelValueGrid } from "@/components/LabelValueGrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetIssuer } from "@/hooks/useIssuer"

type IssuerDetailsProps = {
  issuerAddress: `0x${string}`
}

export function IssuerDetails({ issuerAddress }: IssuerDetailsProps) {
  const issuer = useGetIssuer(issuerAddress)

  return (
    <div className="flex flex-col gap-6">
      {issuer && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>User Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LabelValueGrid
              items={[
                {
                  label: "Username",
                  value: <p>{issuer.username}</p>,
                },
                {
                  label: "Issuer address",
                  value: (
                    <a
                      href={`https://explorer.aptoslabs.com/account/${
                        issuer.issuerAddress
                      }?network=${import.meta.env.VITE_APP_NETWORK}`}
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
              ]}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
