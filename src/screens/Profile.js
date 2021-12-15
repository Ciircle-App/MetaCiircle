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
import {AuthContext} from '../navigation/AuthProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'

const eth_add = require('../../assets/eth_add.webp')
const {height} = Dimensions.get('window')

const Profile = ({navigation}) => {
  const {currentAccount} = useContext(AuthContext)
  const [balance, setBalance] = useState('')
  const [nftsData, setNft] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [asSeller, setAsSeller] = useState(false)

  useEffect(() => {
    navigation.addListener('focus', () => {
      getBalance()
      getNFTs(false, currentAccount)
    })
    getBalance()
    getNFTs(true, currentAccount)
  }, [])

  const getNFTs = async (isLoader, isMyNFTs) => {
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
      let the_nfts
      if (!isMyNFTs) {
        the_nfts = await nftMarket.methods.fetchMyNFTs().call({
          from: await AsyncStorage.getItem('selectedAddress'),
        })
      } else {
        the_nfts = await nftMarket.methods.fetchItemsCreated().call({
          from: await AsyncStorage.getItem('selectedAddress'),
        })
      }
      const nfts = await Promise.all(
        the_nfts.map(async nft => {
          const tokenURI = await nftContract.methods
            .tokenURI(nft.tokenId)
            .call()
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

  const getBalance = async () => {
    const balance = await web3.eth.getBalance(currentAccount)
    setBalance(web3.utils.fromWei(balance, 'ether'))
  }

  if (loading) {
    return <Loader />
  } else if (error) {
    return (
      <>
        <ProfileHeader navigation={navigation} />
        <ErrorView message={errorMessage} tryAgain={() => getNFTs(true)} />
      </>
    )
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileHeader
          navigation={navigation}
          address={currentAccount}
          asSeller={asSeller}
          setAsSeller={setAsSeller}
          getNFTs={getNFTs}
        />
        <NFTDisplayer navigation={navigation} nftsData={nftsData} />
      </SafeAreaView>
    )
  }
}

const ProfileHeader = ({
  navigation,
  address,
  asSeller,
  setAsSeller,
  getNFTs,
}) => {
  return (
    <>
      <Text
        style={styles.address}
        onPress={() => {
          getNFTs(true, !asSeller)
          setAsSeller(!asSeller)
        }}>
        {asSeller ? 'As Seller' : 'As Owner'}
      </Text>
      <View style={styles.header}>
        <Text style={styles.address}>Address: {address || 'Not Found'}</Text>
        <TouchableOpacity
          style={styles.cog}
          onPress={() => {
            navigation.navigate('Settings')
          }}>
          <Ionicons color="#444" size={25} name="cog" />
        </TouchableOpacity>
      </View>
    </>
  )
}

const NFTDisplayer = ({nftsData, navigation}) => {
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
      renderItem={({item}) => <NFTItem item={item} />}
    />
  )
}

const NFTItem = ({item}) => {
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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            {' '}
            Buy Now <Ionicons name="wallet" color="#fff" size={23} />
          </Text>
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

export default Profile

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
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  address: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    width: '60%',
  },
  cog: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
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
