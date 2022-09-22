/**
 * Remember to use this function in the root path of your hardhat project
 */

const fs = require("fs");

///
/// Deployed Contract Address Info Record
///
const readAddressList = function () {
    // const filePath = __dirname + "/address.json"
    return JSON.parse(fs.readFileSync("info/address.json", "utf-8"));
};

const storeAddressList = function (addressList) {
    fs.writeFileSync(
        "info/address.json",
        JSON.stringify(addressList, null, "\t")
    );
};



const getAllowList = () => {
    const allowlist = JSON.parse(fs.readFileSync("info/allowlist.json", "utf-8"));
    return allowlist.list;
}

const getAirdrop = () => {
    const airdropList = JSON.parse(fs.readFileSync("info/airdrop.json", "utf-8"));
    return airdropList.list;
}

module.exports = {
    readAddressList,
    storeAddressList,
    getAirdrop,
    getAllowList
}


