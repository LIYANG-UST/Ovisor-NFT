require("@nomicfoundation/hardhat-toolbox");


require("./tasks")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      // forking: {
      //   url: "https://eth-mainnet.alchemyapi.io/v2/bWpjNreAv-0V7abTFwp_FTDoFYAl9JGt",
      // },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    eth: {
      url: process.env.ETH_URL || "",
      accounts: process.env.PK_ETH !== undefined ? [process.env.PK_ETH] : [],
      timeout: 60000
    },
  },
};
