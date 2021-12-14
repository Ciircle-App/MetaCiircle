import Web3 from 'web3'

const developmentPrivider = 'http://127.0.0.1:7545'
const givenProvider = Web3.givenProvider
const provider_api_key = '7yAOt1e5QkczRwTDg_FG8rCo1GdLIolS'
const provider_url = 'https://eth-mainnet.alchemyapi.io/v2/' + provider_api_key
const provider = givenProvider || developmentPrivider
const web3 = new Web3(new Web3.providers.HttpProvider(provider))

const pinataApiKey = 'dbd74552fe3b4a8126be'
const pinataSecretApiKey =
  'caa0fe38badb78203f2425ae82889e5941c5b230fe40b8ac4145a7fe087fedba'
const jwr =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMGVkYTJkZS00YjQ2LTQ3MTAtOWZhZS0zZmE4ZWYwMTc5MWIiLCJlbWFpbCI6ImFtaXJkaWFmaTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImRiZDc0NTUyZmUzYjRhODEyNmJlIiwic2NvcGVkS2V5U2VjcmV0IjoiY2FhMGZlMzhiYWRiNzgyMDNmMjQyNWFlODI4ODllNTk0MWM1YjIzMGZlNDBiOGFjNDE0NWE3ZmUwODdmZWRiYSIsImlhdCI6MTYzOTQwOTc1NH0.-7cKHYcWwusZGyiMpwHsFTOfczr1Keq44Yt0bbtJDXc'

const pinFileToIPFS = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const pinJsonToIPFS = 'https://api.pinata.cloud/pinning/pinJsonToIPFS'
const pinataEndpoint = 'https://gateway.pinata.cloud/ipfs/'

export {
  web3,
  provider,
  provider_api_key,
  provider_url,
  pinataApiKey,
  pinataSecretApiKey,
  jwr,
  pinFileToIPFS,
  pinJsonToIPFS,
  pinataEndpoint,
}
