import { ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  uri: "https://api.testnet.aptoslabs.com/v1/graphql",
  cache: new InMemoryCache(),
})

export default client
