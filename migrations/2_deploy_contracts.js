// var PreProduction = artifacts.require("./PreProduction.sol");
var NewDemoTest = artifacts.require("./NewDemoTest.sol");

module.exports = function(deployer) {
  deployer.deploy(NewDemoTest)
};
