const ConvertLib = artifacts.require('ConvertLib')
const TransferEth = artifacts.require('TransferEth')

module.exports = function (deployer) {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, TransferEth)
  deployer.deploy(TransferEth)
}
