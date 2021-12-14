const NFTMarket = artifacts.require('NFTMarket')
const CreateNFT = artifacts.require('CreateNFT')

module.exports = async deployer => {
  await deployer.deploy(NFTMarket)
  // get market address after deployment and pass it to the nft creator contract
  const market = await NFTMarket.deployed()
  const marketAddress = market.address
  await deployer.deploy(CreateNFT, marketAddress)
}
