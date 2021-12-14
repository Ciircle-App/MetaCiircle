import React, {useState, useEffect} from 'react'
import {
  ActionSheetIOS,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import NFTMarket from '../../build/contracts/NFTMarket.json'
import CreateNFT from '../../build/contracts/CreateNFT.json'
import {
  pinataApiKey,
  web3,
  pinataSecretApiKey,
  pinFileToIPFS,
  pinJsonToIPFS,
  pinataEndpoint,
} from '../../libs/configs'
import Icon from 'react-native-vector-icons/Ionicons'
import Snackbar from 'react-native-snackbar'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Create = ({navigation}) => {
  const [image, setImage] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')

  const getAddress = async () => {
    try {
      const selectedAddress = await AsyncStorage.getItem('selectedAddress')
      const accounts = await web3.eth.getAccounts()
      const currentAddress = selectedAddress || accounts[0]
      setAddress(currentAddress)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getAddress()
    })
    getAddress()
  }, [])

  const handleSubmit = async theIpfsHash => {
    console.log('theIpfsHash...', theIpfsHash)
    if (
      name.length === 0 ||
      description.length === 0 ||
      price.length === 0
      // !theIpfsHash
    ) {
      console.log('required....')
      setLoading(false)
      showSnakError("You can't create an empty NFT")
      return
    }
    try {
      // Global variables
      const netId = await web3.eth.net.getId()
      const imageUri = pinataEndpoint + theIpfsHash

      // CreateNFT
      const createNFTAddress = CreateNFT.networks[netId].address
      const createNFTContract = new web3.eth.Contract(
        CreateNFT.abi,
        createNFTAddress,
      )

      // NFTMarket
      const nftMarketAddress = NFTMarket.networks[netId].address
      const nftMarketContract = new web3.eth.Contract(
        NFTMarket.abi,
        nftMarketAddress,
      )

      const res = await createNFTContract.methods.createNFT(imageUri).send({
        from: address,
        gas: 3000000,
      })
      const tokenId = res.events.Transfer.returnValues.tokenId
      console.log('tokenId ===>', tokenId)
      const price_in_ither = web3.utils.toWei(price, 'ether')
      const listingPrice = await nftMarketContract.methods
        .getListingPrice()
        .call()
      const listing_price_in_ether = web3.utils.fromWei(listingPrice, 'ether')

      await nftMarketContract.methods
        .createMarketItem(createNFTAddress, Number(tokenId), price_in_ither)
        .send({
          from: address,
          value: listingPrice,
          gas: 3000000,
        })
      showSeccessSnack()
      reset()
      navigation.navigate('Home')
    } catch (error) {
      showSnakError(error.message)
      setLoading(false)
      console.log('error ==>>>', error.message)
    }
  }

  const reset = () => {
    setLoading(false)
    setName('')
    setDescription('')
    setPrice('')
    setImage(null)
  }

  const uploadImage = async () => {
    setLoading(true)
    let data = new FormData()
    data.append('file', {
      uri: image.uri,
      name: image.fileName,
      type: image.type,
    })
    return fetch(pinFileToIPFS, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setLoading()
        if (response.IpfsHash) {
          uploadMetaData(response.IpfsHash)
        } else {
          showSnakError(response.message)
          setLoading(false)
        }
        return response
      })
      .catch(error => {
        showSnakError(error.message)
        setLoading(false)
        return error
      })
  }

  const uploadMetaData = theIpfsHash => {
    const imageUri = pinataEndpoint + theIpfsHash
    const price_in_ither = web3.utils.toWei(price, 'ether')
    const metaData = JSON.stringify({
      name,
      description,
      image: imageUri,
      price: price_in_ither,
      attributes: [],
    })
    return fetch(pinJsonToIPFS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
      body: metaData,
    })
      .then(response => response.json())
      .then(response => {
        console.log('response JSON md', response)
        setLoading()
        if (response.IpfsHash) {
          handleSubmit(response.IpfsHash)
        } else {
          showSnakError(response.message)
          setLoading(false)
        }
        return response
      })
      .catch(error => {
        showSnakError(error.message)
        setLoading(false)
        return error
      })
  }

  const showSnakError = error => {
    Snackbar.show({
      text: error || "Can't upload image",
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#FF5252',
    })
  }

  const showSeccessSnack = () => {
    Snackbar.show({
      text: 'Image Uploaded Successfully.',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#16C79A',
    })
  }

  const openCamera = () => {
    launchCamera({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        setImage(response)
      }
    })
  }

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        allowsEditing: true,
        aspect: [4, 3],
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker')
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton)
        } else {
          setImage(response.assets[0])
        }
      },
    )
  }

  const showActionSheetToPick = () => {
    const options = ['Camera', 'Gallery', 'Cancel']
    const cancelButtonIndex = 2
    const destructiveButtonIndex = 1
    const title = 'Select Image'
    const message = 'Select Image from Camera or Gallery'
    const showActionSheetWithOptions = (
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
      title,
      message,
    ) => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
          title: message,
          //   message,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            openCamera()
          } else if (buttonIndex === 1) {
            pickImage()
          }
        },
      )
    }
    showActionSheetWithOptions(
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
      title,
      message,
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroContainer}>
        <Text style={styles.title}>Create Post</Text>
        {image?.uri ? (
          <Image source={{uri: image?.uri}} style={styles.imagePicked} />
        ) : (
          <TouchableOpacity
            style={styles.imagePicked}
            onPress={showActionSheetToPick}>
            <Icon name="camera" size={50} color="#555" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.inputLable}>Title</Text>
        <TextInput
          placeholder="Title"
          value={name}
          style={styles.input}
          onChangeText={value => {
            setName(value)
          }}
        />
        <Text style={styles.inputLable}>Description</Text>
        <TextInput
          placeholder="Description"
          style={styles.input}
          value={description}
          onChangeText={value => {
            setDescription(value)
          }}
        />
        <Text style={styles.inputLable}>Price</Text>
        <TextInput
          placeholder="5.00 ETH"
          style={styles.input}
          value={price}
          onChangeText={value => {
            setPrice(value)
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={loading}
            style={styles.button}
            onPress={() => {
              if (image) {
                uploadImage()
              } else {
                showActionSheetToPick()
              }
            }}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {image ? 'Submit' : 'Upload'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  imagePicked: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  formContainer: {
    marginTop: 10,
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    height: 45,
  },
  inputLable: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginTop: 10,
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
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
})
