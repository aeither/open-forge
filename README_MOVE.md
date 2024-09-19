
## new account

```bash
https://aptos.dev/en/network/nodes/validator-node/connect-nodes/connect-to-aptos-network#1-initialize-the-aptos-cli
```

```bash
aptos init --profile test3 --network testnet --assume-yes
```

## faucet 1 APT

```bash
aptos account fund-with-faucet \
  --account 0xa74e58653dc32123a0cf1d8deb216a4fea2c0d55d1ef989b8f62d529defdc2e7 \
  --amount 100000000 \
  --url https://fullnode.testnet.aptoslabs.com \
  --faucet-url https://faucet.testnet.aptoslabs.com
```


### Test or Compile

```bash
aptos move test  \
  --package-dir move \
  --named-addresses aptos_friend_addr="0x100" \
  --skip-fetch-latest-git-deps
```

## Refresh ABI

```bash
bun move:test && bun move:get-abi
```

## Deploy

```bash
source .env && aptos move create-resource-account-and-publish-package \
  --package-dir move \
  --address-name aptos_friend_addr \
  --profile aptos-friend-testnet \
  --named-addresses aptos_friend_addr=$aptos_friend_addr \
  --skip-fetch-latest-git-deps \
  --assume-yes \
  --seed "$(openssl rand -hex 32)"
```


## Interact

```bash
npx tsx scripts/ts/surf_issue_buy_share.ts
```

## Run script

```bash
aptos move run-script \
    --compiled-script-path move/build/AptosFriend/bytecode_scripts/issue_share_and_buy_share.mv \
    --profile test3 \
    --skip-fetch-latest-git-deps \
    --assume-yes
```


<!-- 
  Nodit API Queries
-->


Get the ABI

```bash
source .env && curl --request GET \
     --url https://aptos-testnet.nodit.io/v1/accounts/0x45f0e092310103dd54abbd6eea30839fc867843560a7f36ddbc05b27b3b00677/module/product_nft \
     --header 'X-API-KEY: $NODIT_API_KEY' \
     --header 'accept: application/json'
```


<!-- 
  May be useful
-->

# aptos-move-contracts


## Setup

```bash
aptos move init
```

create `.aptos` file with an aptos account

```bash
aptos init
```

## Dev

```bash
aptos move test --skip-fetch-latest-git-deps
```

## Publish

Faucet

```bash
source .env && aptos account fund-with-faucet \
  --account $launchpad_addr \
  --url "https://fullnode.testnet.aptoslabs.com" \
  --faucet-url "https://faucet.testnet.aptoslabs.com"
```

## ABI

```bash
https://explorer.aptoslabs.com/account/REPLACE_ADDRESS_HERE/modules?network=testnet
```

## Format:

```bash
aptos move fmt
```
