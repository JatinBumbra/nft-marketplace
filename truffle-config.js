module.exports = {
  contracts_build_directory: './contracts/build',

  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 7545, // Ganache Port
      network_id: '*', // Any network (default: none)
    },
  },

  compilers: {
    solc: {
      version: '0.8.10', // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200,
        },
      },
    },
  },
};
