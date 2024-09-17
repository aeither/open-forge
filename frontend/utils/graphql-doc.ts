import { gql } from "@apollo/client";

/**
 * Edit on Hasura
 * https://cloud.hasura.io/public/graphiql?endpoint=https://api.testnet.aptoslabs.com/v1/graphql
 */
export const GET_COLLECTION_NFTS = gql`
  query GetCollectionNfts($collection_name: String) {
    current_token_datas_v2(
      where: {current_collection: {collection_name: {_eq: $collection_name}}}
      order_by: {last_transaction_timestamp: desc}
    ) {
      token_name
      description
      token_uri
      collection_id
      last_transaction_timestamp
      token_data_id
      token_properties
    }
  }
`