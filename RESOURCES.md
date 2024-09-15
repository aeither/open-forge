
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

## Refresh ABI

```bash
bun move:test && bun move:get-abi
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
  This is a much larger comment block.
  It contains multiple lines of text.
  The text is used to explain the purpose of the code.
  It can also be used to provide additional context.
  The comment block can be as large as needed.
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

Compile

```bash
aptos move compile --named-addresses launchpad_addr=$launchpad_addr,minter=$minter  --skip-fetch-latest-git-deps 
```

Deploy

```bash
source .env && aptos move create-resource-account-and-publish-package \
  --package-dir . \
  --address-name launchpad_addr \
  --profile aptos-move-contracts-testnet \
  --named-addresses initial_creator_addr=$initial_creator_addr,launchpad_addr=$launchpad_addr,minter=$minter \
  --skip-fetch-latest-git-deps \
  --assume-yes \
  --seed "$(openssl rand -hex 32)"
```

## ABI

```bash
https://explorer.aptoslabs.com/account/REPLACE_ADDRESS_HERE/modules?network=testnet
```

## Format:

```bash
aptos move fmt
```
