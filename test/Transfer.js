const NFT = artifacts.require('TransferEth')

contract('Transfer ETH', function (accounts) {
  it('Transfer Success', () => {
    NFT.deployed().then(instance => {
      const app = instance
      const amount = web3.utils.toWei('0.1', 'ether')
      return app
        .sendCoin(accounts[0], amount, {
          from: accounts[0],
        })
        .then(() => {
          return app.getBalance(accounts[0]).then(balance => {
            assert.equal(balance.toString(), amount)
          })
        })
    })
  })
})
