require("dotenv").config()

const cli = require("@aptos-labs/ts-sdk/dist/common/cli/index.js")

async function test() {
  const move = new cli.Move()

  await move.test({
    packageDirectoryPath: "move",
    namedAddresses: {
      aptos_friend_addr: "0x100",
      // user_addr: "0x101",
    },
    extraArguments: ["--skip-fetch-latest-git-deps"],
  })
}
test()
