const NFT = artifacts.require('NFT');
const Market = artifacts.require('Market');

module.exports = async function (deployer) {
  await deployer.deploy(Market);
  const market = await Market.deployed();

  await deployer.deploy(NFT, market.address);
};
