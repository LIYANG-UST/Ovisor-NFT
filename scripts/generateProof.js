const keccak256 = require("keccak256");
const { default: MerkleTree } = require("merkletreejs");
const { getAirdrop } = require("./contractAddress");


const getAllowlistProof = function (address) {
    const allowlist = getAllowList();
    const stdList = allowlist.map(address => hre.ethers.utils.getAddress(address))
    console.log("Full allowlist: ", stdList);

    const leaves = stdList.map(account => keccak256(account))
    const tree = new MerkleTree(leaves, keccak256, { sort: true })

    const proof = tree.getHexProof(keccak256(address))

    console.log("allowlist proof ", proof)

    return proof
}


const getAirdropProof = function (address) {
    const airdropList = getAirdrop();
    const stdList = airdropList.map(address => hre.ethers.utils.getAddress(address))
    console.log("Full allowlist: ", stdList);

    const leaves = stdList.map(account => keccak256(account))
    const tree = new MerkleTree(leaves, keccak256, { sort: true })

    const proof = tree.getHexProof(keccak256(address))

    console.log("airdrop proof ", proof)

    return proof
}

module.exports = {
    getAllowlistProof,
    getAirdropProof
}