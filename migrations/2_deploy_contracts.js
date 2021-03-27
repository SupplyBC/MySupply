var PharmaChain = artifacts.require("./PharmaChain.sol");
var PharmaChainTracking = artifacts.require("./PharmaChainTracking.sol");

module.exports = function(deployer) {
  deployer.deploy(PharmaChain)
  deployer.deploy(PharmaChainTracking)
};
