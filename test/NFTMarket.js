const NFTMarket = artifacts.require('NFTMarket')
const CreateNFT = artifacts.require('CreateNFT')

contract('Create NFT Market', function (accounts) {
  it('NFT Market', async () => {
    const market = await NFTMarket.deployed()
    const marketAddress = market.address
    const txParams = {
      from: accounts[0],
    }
    const account = accounts[0]
    const createNFT = await CreateNFT.deployed()
    const nftAddress = createNFT.address
    const listingPrice = await market.getListingPrice()
    const auctionPrice = web3.utils.toWei('0.01', 'ether')

    await createNFT.createNFT('https://myTokenLocation.com')
    await createNFT.createNFT('https://myTokenLocation_1.com')

    await market.createMarketItem(nftAddress, 1, auctionPrice, {
      value: listingPrice,
    })
    await market.createMarketItem(nftAddress, 2, auctionPrice, {
      value: listingPrice,
    })

    await market.createMarketSale(nftAddress, 1, {
      from: account,
      value: auctionPrice,
    })

    let items = await market.fetchMarketItems()
    items = await Promise.all(
      items.map(async i => {
        const tokenURI = await createNFT.tokenURI(i.tokenId)
        let item = {
          price: web3.utils.fromWei(i.price, 'ether'),
          tokenId: i.tokenId,
          owner: i.owner,
          seller: i.seller,
          tokenURI,
        }
        return item
      }),
    )
    console.log('items', items)
  })
})
