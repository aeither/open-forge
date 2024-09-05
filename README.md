## Open Forge

https://open-forge-eight.vercel.app/

### Open Forge Overview

Open Forge is a platform that makes supporting public goods in the Aptos ecosystem more fun and rewarding. It connects people who want to help with those who are building things, and it lets them earn money from open-source software and content. The platform uses AI to make predictions, community-driven randomness on the blockchain, and gamification to create a unique experience. With Aptos' technology and quick microtransactions, Open Forge makes it easy and engaging to support public goods.

You can learn more about how Open Forge is changing the way public goods work in the Aptos ecosystem.

### What tools the template uses?

- React framework
- Vite development tool
- shadcn/ui + tailwind for styling
- Aptos TS SDK
- Aptos Wallet Adapter
- Node based Move commands

### What Move commands are available?

The tool utilizes [aptos-cli npm package](https://github.com/aptos-labs/aptos-cli) that lets us run Aptos CLI in a Node environment.

Some commands are built-in the template and can be ran as a npm script, for example:

- `bun move:init` - a command to initialize an account to publish the Move contract and to configure the development environment
- `bun move:test` - a command to run Move unit tests
- `bun move:publish` - a command to publish the Move contract
- `bun move:upgrade` - a command to upgrade the Move contract
- `bun move:get-abi` - a command to download the ABI of the contract
- `bun move:issue-share-and-buy-share` - a command to run a Move script that will issue share and buy share in one transaction

For all other available CLI commands, can run `npx aptos` and see a list of all available commands.
