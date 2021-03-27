// var PreProduction = artifacts.require("./PreProduction.sol");
var NewDemoTest = artifacts.require("./NewDemoTest.sol");
var test        = artifacts.require("./test.sol")

module.exports = function(deployer) {
  deployer.deploy(NewDemoTest)
  deployer.deploy(test)
};
