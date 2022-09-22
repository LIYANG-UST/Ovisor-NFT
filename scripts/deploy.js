
const { ethers } = require("hardhat");
const hre = require("hardhat");
const { readAddressList, storeAddressList } = require("./contractAddress");

async function main() {
  const addressList = readAddressList();

  const { network } = hre;

  const nftContract = await ethers.getContractFactory("OvisorNFT");
  const nft = await nftContract.deploy(ethers.constants.AddressZero);

  await nft.deployed();

  console.log(
    `deployed to ${nft.address}`
  );

  addressList[network.name].OvisorNFT = nft.address;

  storeAddressList(addressList);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
