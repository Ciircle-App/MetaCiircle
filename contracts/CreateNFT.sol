// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract CreateNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address _marketAddress) ERC721('Meta Ciircle NFT', 'MCNFT') {
        contractAddress = _marketAddress;
    }

    function createNFT(string memory _uri) public returns (uint256 _tokenId) {
        // Increament the tokenIds counter - this token id is the next available token id
        _tokenIds.increment();
        // Get the current tokenId - this is the token id we are creating
        uint256 tokenId = _tokenIds.current();
        // Mint the token to the owner of the contract - this function is defined in ERC721
        _mint(msg.sender, tokenId);
        // Now set the token URI - this function is defined in the ERC721URIStorage
        _setTokenURI(tokenId, _uri);
        // Set approval from all addresses to the owner of the contract
        setApprovalForAll(contractAddress, true);
        // Return the tokenId
        return tokenId;
    }
}
