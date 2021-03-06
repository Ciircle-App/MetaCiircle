// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/Security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContact;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private _marketItems;

    event ItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address payable seller,
        address payable owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns (uint256 _listingPrice) {
        uint256 the_listing_price = listingPrice;
        return the_listing_price;
    }

    function setListingPrice(uint256 _listingPrice) public {
        listingPrice = _listingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, 'Price must be at least 1 wei');
        require(
            msg.value == listingPrice,
            'Price must be equal to listing price'
        );

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        _marketItems[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit ItemCreated(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
    }

    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = _marketItems[itemId].price;
        uint256 tokenId = _marketItems[itemId].tokenId;
        address seller = _marketItems[itemId].seller;
        require(
            msg.value == price,
            'Please submit the asking price in order to complete the purchase'
        );
        require(msg.sender != seller, 'The seller can not be the buyer');

        _marketItems[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        _marketItems[itemId].owner = payable(msg.sender);
        _marketItems[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (_marketItems[i + 1].owner == address(0)) {
                uint256 currentId = _marketItems[i + 1].itemId;
                MarketItem storage currentItem = _marketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        require(msg.sender != address(0), 'Please pass the your address');

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (_marketItems[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (_marketItems[i + 1].owner == msg.sender) {
                uint256 currentId = _marketItems[i + 1].itemId;
                MarketItem storage currentItem = _marketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        return items;
    }

    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        require(msg.sender != address(0), 'Please pass the your address');

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (_marketItems[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (_marketItems[i + 1].seller == msg.sender) {
                uint256 currentId = _marketItems[i + 1].itemId;
                MarketItem storage currentItem = _marketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        return items;
    }
}
