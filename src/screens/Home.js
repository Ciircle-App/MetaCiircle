import React, {useEffect, useState, useContext} from 'react'
import {
  Text,
  SafeAreaView,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native'
import NFTMarket from '../../build/contracts/NFTMarket.json'
import CreateNFT from '../../build/contracts/CreateNFT.json'
import {web3} from '../../libs/configs'
import ErrorView from '../components/common/ErrorView'
import {TouchableOpacity} from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Snackbar from 'react-native-snackbar'
import {AuthContext} from '../navigation/AuthProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'

const eth_add = require('../../assets/eth_add.webp')
const {height} = Dimensions.get('window')

const Home = ({navigation}) => {
  const [balance, setBalance] = useState('')
  const {currentAccount} = useContext(AuthContext)
  const [nftsData, setNft] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  web3

  useEffect(() => {
    navigation.addListener('focus', () => {
      getNFTs(false)
      getBalance()
    })
    getNFTs(true)
    getBalance()
  }, [])

  const getNFTs = async isLoader => {
    setLoading(isLoader)
    try {
      const netId = await web3.eth.net.getId()
      const contractAddress = NFTMarket.networks[netId].address
      const nftContractAddress = CreateNFT.networks[netId].address
      const nftContract = new web3.eth.Contract(
        CreateNFT.abi,
        nftContractAddress,
      )
      const nftMarket = new web3.eth.Contract(NFTMarket.abi, contractAddress)
      const the_nfts = await nftMarket.methods.fetchMarketItems().call()
      const nfts = await Promise.all(
        the_nfts.map(async nft => {
          const tokenURI = await nftContract.methods
            .tokenURI(nft.tokenId)
            .call()
          console.log('tokenURI', tokenURI)
          const meta = await fetch(tokenURI)
          const metaData = await meta.json()
          return {
            price: web3.utils.fromWei(nft.price, 'ether'),
            tokenId: nft.tokenId,
            seller: nft.seller,
            owner: nft.owner,
            sold: nft.sold,
            image: metaData.image,
            name: metaData.name,
            description: metaData.description,
          }
        }),
      )
      setNft(nfts)
      setError(false)
    } catch (error) {
      setError(true)
      setErrorMessage(error.message)
    }
    setTimeout(() => {
      setLoading(false)
    }, 0)
  }

  const buyNFT = async (tokenId, price) => {
    setIsBuying(true)
    try {
      const the_price = web3.utils.toWei(price, 'ether')
      const netId = await web3.eth.net.getId()
      const createContractAddress = CreateNFT.networks[netId].address
      const contractAddress = NFTMarket.networks[netId].address
      const nftMarket = new web3.eth.Contract(NFTMarket.abi, contractAddress)

      await nftMarket.methods
        .createMarketSale(createContractAddress, tokenId)
        .send({
          from: await AsyncStorage.getItem('selectedAddress'),
          value: the_price,
          gas: 3000000,
        })
      showSnakBar()
    } catch (error) {
      showSnakError(error.message)
    }
    setTimeout(() => setIsBuying(false), 0)
  }

  const showSnakBar = () => {
    Snackbar.show({
      text: 'Transaction Successful',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#77ACF1',
    })
  }

  const showSnakError = error => {
    Snackbar.show({
      text: error || 'Transaction Failed',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#FF5252',
    })
  }

  const getBalance = async () => {
    const balance = await web3.eth.getBalance(currentAccount)
    setBalance(web3.utils.fromWei(balance, 'ether'))
  }

  if (loading) {
    return <Loader />
  } else if (error) {
    return <ErrorView message={errorMessage} tryAgain={() => getNFTs(true)} />
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <NFTDisplayer
          isBuying={isBuying}
          navigation={navigation}
          nftsData={nftsData}
          buyNFT={buyNFT}
        />
      </SafeAreaView>
    )
  }
}

const NFTDisplayer = ({nftsData, navigation, isBuying, buyNFT}) => {
  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={nftsData}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Image style={styles.eth_add} source={eth_add} />
          <Text style={styles.emptyTitle}>No items yet 🖼</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('Create')
            }}>
            <Text style={styles.buttonText}>Add an Item</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({item}) => (
        <NFTItem item={item} isBuying={isBuying} buyNFT={buyNFT} />
      )}
    />
  )
}

const NFTItem = ({item, isBuying, buyNFT}) => {
  return (
    <View style={nftStyles.itemContainer}>
      <Image style={nftStyles.image} source={{uri: item?.image}} />
      <View style={nftStyles.itemContent}>
        <View style={nftStyles.titleContainer}>
          <Text style={nftStyles.title}>{item?.name}</Text>
          <View style={nftStyles.priceContainer}>
            <Text style={nftStyles.price}>{item?.price} </Text>
            <MaterialCommunityIcons name="ethereum" size={23} color="#333" />
          </View>
        </View>
        <Text style={nftStyles.desc}>{item?.description}</Text>
        <Text style={nftStyles.desc}>tokenId: {item?.tokenId}</Text>
        <Text style={nftStyles.desc}>seller :{item?.seller}</Text>
        <Text style={nftStyles.desc}>owner: {item?.owner}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={isBuying}
          style={styles.button}
          onPress={() => {
            buyNFT(item?.tokenId, item?.price)
          }}>
          {isBuying ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>
              {' '}
              Buy Now <Ionicons name="wallet" color="#fff" size={23} />
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const Loader = () => {
  return (
    <SafeAreaView style={styles.loader}>
      <ActivityIndicator size="large" color="#000" />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 10,
  },
  emptyContainer: {
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 30,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#77ACF1',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  eth_add: {
    width: 300,
    height: 200,
  },
})

const nftStyles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#F8EDE3',
    padding: 15,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 5,
    backgroundColor: '#00000030',
    marginBottom: 15,
  },
  itemContent: {
    marginTop: 5,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  priceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  priceLogo: {
    width: 15,
    height: 25,
  },
  desc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
})
