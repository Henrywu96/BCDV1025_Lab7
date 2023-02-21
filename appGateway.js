'use strict'

const { Gateway } = require('fabric-network');
const utils = require('./utils');
const orgConfig = require('./connections/org1-config.json');


module.exports = async function (userId) {
    const ccp = utils.buildCCPOrg(orgConfig.orgName);

    const gateway = new Gateway();

    const wallet = await utils.buildWallet();

    try {
        await gateway.connect(ccp, {
            wallet,
            identity: userId,
            discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
        });

        const network = await gateway.getNetwork(orgConfig.channelName);

        const contract = network.getContract(orgConfig.chaincodename);
        return contract;

    } catch (err) {
        console.log("Err: ", err);
    }

}

exports.invoke = async function (userId) {
    try {
        const contract = await module.exports.getContract(userId);
        const response = await contract.submitTransaction('InitLedger');

        return response;
    } catch (err) {
        console.log(err);
    }
}

exports.query = async function (userId) {
    try {
        const contract = await module.exports.getContract(userId);
        const response = await contract.evaluateTransaction('GetAllCustomers');

        return response;
    } catch (err) {
        console.log(err);
    }
}




module.exports.invoke('admin').then((result) => {
    console.log(`*** Result: ${utils.prettyJSONString(result.toString())}`);
}).catch(console.log);
// module.exports(orgConfig.userId).then(console.log);