
const { types, task } = require("hardhat/config");
const { getAllowList, getAirdrop } = require("../scripts/allowList");
const { readAddressList } = require("../scripts/contractAddress");

require("@nomiclabs/hardhat-ethers")


const { MerkleTree } = require('merkletreejs');
const { getAirdropProof, getAllowlistProof } = require("../scripts/generateProof");

const addressList = readAddressList();


// Status: 0 Init 1 Airdrop 2 Allowlist Sale 3 Public Sale
task("setStatus", "Set status of nft contract")
    .addParam("status", "Status to be changed", null, types.int)
    .setAction(async (args, hre) => {
        const { network } = hre;

        const [dev_account] = await hre.ethers.getSigners();
        console.log("signer address:", dev_account.address);

        const nftFactory = await hre.ethers.getContractFactory("OvisorNFT");
        const nftAddress = addressList[network.name].OvisorNFT;
        const nft = nftFactory.attach(nftAddress);

        const initStatus = await nft.status();
        console.log("Init status: ", initStatus.toNumber());

        const tx = await nft.setStatus(args.status);
        console.log("Tx details:", await tx.wait());

        const currentStatus = await nft.status();
        console.log("Status after change: ", currentStatus.toNumber());
    })

task("setAirdropRoot", "Set merkle root of airdrop")
    .setAction(async (_, hre) => {
        const { network } = hre;
        const { keccak256 } = hre.ethers.utils;


        const [dev_account] = await hre.ethers.getSigners();
        console.log("signer address:", dev_account.address);

        const airdropList = getAirdrop();
        const stdList = airdropList.map(address => hre.ethers.utils.getAddress(address))
        console.log("Full airdrop list: ", stdList);

        const leaves = stdList.map(account => keccak256(account))
        const tree = new MerkleTree(leaves, keccak256, { sort: true })
        const merkleRoot = tree.getHexRoot();

        console.log("New root to set: ", merkleRoot);

        const nftFactory = await hre.ethers.getContractFactory("OvisorNFT");
        const nftAddress = addressList[network.name].OvisorNFT;
        const nft = nftFactory.attach(nftAddress);

        const tx = await nft.setAirdropMerkleRoot(merkleRoot);
        console.log("Tx details: ", await tx.wait())
    })

task("setAllowlistRoot", "Set merkle root of allowlist")
    .setAction(async (_, hre) => {
        const { network } = hre;
        const { keccak256 } = hre.ethers.utils;


        const [dev_account] = await hre.ethers.getSigners();
        console.log("signer address:", dev_account.address);

        const allowlist = getAllowList();
        const stdList = allowlist.map(address => hre.ethers.utils.getAddress(address))
        console.log("Full allowlist: ", stdList);

        const leaves = stdList.map(account => keccak256(account))
        const tree = new MerkleTree(leaves, keccak256, { sort: true })
        const merkleRoot = tree.getHexRoot();

        console.log("New root to set: ", merkleRoot);

        const nftFactory = await hre.ethers.getContractFactory("OvisorNFT");
        const nftAddress = addressList[network.name].OvisorNFT;
        const nft = nftFactory.attach(nftAddress);

        const tx = await nft.setAllowlistMerkleRoot(merkleRoot);
        console.log("Tx details: ", await tx.wait())
    })


task("mintAirdrop", "Mint airdrop for users")
    .setAction(async (_, hre) => {
        const { network } = hre;

        const [dev_account] = await hre.ethers.getSigners();
        console.log("signer address:", dev_account.address);

        const airdropList = await getAirdrop();
        const stdList = airdropList.map(address => hre.ethers.utils.getAddress(address))
        console.log("airdrop list:", stdList);

        const nftFactory = await hre.ethers.getContractFactory("OvisorNFT");
        const nftAddress = addressList[network.name].OvisorNFT;
        const nft = nftFactory.attach(nftAddress);

        const tx = await nft.mintAirdrop(airdropList);
        console.log("Mint airdrop", await tx.wait());

        const mintedAmount = await nft.mintedAmount();
        console.log("minted amount", mintedAmount.toNumber())
    })

task("transferNFT", "Transfer degis nft from owner")
    .addParam("id", "Token id", null, types.int)
    .addParam("address", "Receiver Address", null, types.string)
    .setAction(async (args, hre) => {
        const { network } = hre;

        const [dev_account] = await hre.ethers.getSigners();
        console.log("signer address:", dev_account.address);

        const nftFactory = await hre.ethers.getContractFactory("OvisorNFT");
        const nftAddress = addressList[network.name].OvisorNFT;
        const nft = nftFactory.attach(nftAddress);

        const initOwner = await nft.ownerOf(args.id);
        console.log("init owner: ", initOwner)

        const tx = await nft.transferFrom(dev_account.address, args.address, args.id);
        console.log("Mint airdrop", await tx.wait());

        const owner = await nft.ownerOf(args.id);
        console.log("current owner: ", owner)
    })


task("setBaseURI", "Set the baseURI of degis nft")
    .addParam("uri", "base uri", null, types.string)
    .setAction(async (args, hre) => {
        const { network } = hre;

        const [dev_account] = await hre.ethers.getSigners();
        console.log("signer address:", dev_account.address);

        const nftFactory = await hre.ethers.getContractFactory("OvisorNFT");
        const nftAddress = addressList[network.name].OvisorNFT;
        const nft = nftFactory.attach(nftAddress);


        const tx = await nft.setBaseURI(args.uri);
        console.log("Tx details: ", await tx.wait());

        const baseURI = await nft.baseURI();
        console.log("Base uri: ", baseURI);
    })


task("ownerMint", "Owner mint some nfts")
    .addParam("address", "Receiver address", null, types.string)
    .addParam("amount", "Amount to mint", null, types.int)
    .setAction(async (args, hre) => {
        const { network } = hre;

        const [dev_account] = await hre.ethers.getSigners();
        console.log("signer address: ", dev_account.address);

        const nftFactory = await hre.ethers.getContractFactory("OvisorNFT");
        const nftAddress = addressList[network.name].OvisorNFT;
        const nft = nftFactory.attach(nftAddress);

        const alreadyMintedBefore = await nft.mintedAmount();
        console.log("Already minted before: ", alreadyMintedBefore.toNumber());

        const balanceBefore = await nft.balanceOf(args.address);
        console.log("NFT balance before: ", balanceBefore.toNumber())

        const tx = await nft.ownerMint(args.address, args.amount);
        console.log("Tx details: ", await tx.wait());

        const alreadyMintedAfter = await nft.mintedAmount();
        console.log("Already minted after: ", alreadyMintedAfter.toNumber());

        const balanceAfter = await nft.balanceOf(args.address);
        console.log("NFT balance after: ", balanceAfter.toNumber())
    })

task("setPrice", "Set price for public sale or allowlist sale")
    .addParam("type", "Type", null, types.string)
    .addParam("price", "Sale price in ether", null, types.string)
    .setAction(async (args, hre) => {
        const { network } = hre;

        const [dev_account] = await hre.ethers.getSigners();
        console.log("signer address: ", dev_account.address);

        const nftFactory = await hre.ethers.getContractFactory("OvisorNFT");
        const nftAddress = addressList[network.name].OvisorNFT;
        const nft = nftFactory.attach(nftAddress);

        if (args.type == "publicSale") {
            const tx = await nft.setPublicSalePrice(hre.ethers.utils.parseUnits(args.price));
            console.log("Tx details: ", await tx.wait());

            const price = await nft.publicSalePrice();
            console.log("Public sale price: ", hre.ethers.utils.formatUnits(price), " ether");
        }

        else if (args.type == "allowlistSale") {
            const tx = await nft.setAllowlistSalePrice(hre.ethers.utils.parseUnits(args.price));
            console.log("Tx details: ", await tx.wait());

            const price = await nft.allowlistSalePrice();
            console.log("Allowlist sale price: ", hre.ethers.utils.formatUnits(price), " ether");
        }

    })

task("getProof", "Get proof for airdrop or allowlist")
    .addParam("type", "Type", null, types.string)
    .addParam("address", "Address", null, types.string)
    .setAction(async (args, hre) => {
        const { network } = hre;

        const [dev_account] = await hre.ethers.getSigners();
        console.log("signer address: ", dev_account.address);

        const nftFactory = await hre.ethers.getContractFactory("OvisorNFT");
        const nftAddress = addressList[network.name].OvisorNFT;
        const nft = nftFactory.attach(nftAddress);


        if (args.type == "airdrop") {
            const proof = getAirdropProof(args.address);
            console.log("Proof: ", proof);
        }

        else if (args.type == "allowlistSale") {
            const proof = getAllowlistProof(args.address);
            console.log("Proof: ", proof);
        }
    })