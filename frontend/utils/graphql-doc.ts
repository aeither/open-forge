import { gql } from "@apollo/client"

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

export const GET_COLLECTION_NFTS_BY_OWNER = gql`
  query GetCollectionNfts($collection_name: String, $owner_address: String) {
    current_token_datas_v2(
      where: {current_collection: {collection_name: {_eq: $collection_name}}, current_token_ownerships: {owner_address: {_eq: $owner_address}}}
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

// Get NFT supply
// query GetCollectionNfts($collection_name: String!) {
//   current_collections_v2(
//     where: {collection_name: {_eq: $collection_name}}
//   ) {
//     collection_name
//     description
//     uri
//     creator_address
//     max_supply
//     total_minted_v2
//     token_standard

//   }
// }

// Get NFT by token data id
export const GET_ACCOUNT_NFT = gql`
query GetAccountNft($token_data_id: String) {
  current_token_ownerships_v2(where: {token_data_id: {_eq: $token_data_id}}) {
    current_token_data {
      description
      token_name
      token_data_id
      token_standard
      token_uri
      last_transaction_timestamp
      __typename
      token_properties
    }
    owner_address
    __typename
    amount
  }
}

`
