// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

// Open source contracts which follow the ERC721 NFT standard
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Market is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor () {
        // Marketplace owner
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

      event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // Returns the listing price
    function getListingPrice() public view returns(uint256) {
        return listingPrice;
    }

    // Place an NFT for sale on marketplace
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price 
    ) public payable nonReentrant {
        require(price > 0, 'Price must be atleast 1 wei');
        require(msg.value == listingPrice, 'Please provide listing price value');
        // Create an ID for the NFT
        _itemIds.increment();
        uint itemId = _itemIds.current();
        // Map the NFT to marketplace items
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender), // Creator is the seller
            payable(address(0)), // NFT not sold to anybody yet
            price,
            false
        );
        // Transfer NFT contract from seller to marketplace
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    // Create a sale
    function createMarketSale(address nftContract, uint256 itemId) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;

        require(msg.value == price, "Please provide the asked for price for the NFT");
        // Pay the seller the amount received for the NFT
        idToMarketItem[itemId].seller.transfer(msg.value);
        // Transfer NFT contract from marketplace to buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        // Update the owner of the NFT
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        // Transfer the marketplace owner the listing fee once the sale is made
        payable(owner).transfer(listingPrice);
    }

    // Fetches the items which are currently for sale on marketplace
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        // Calculate the number of items that have not been sold
        uint totalItemsCount = _itemIds.current();
        uint unsoldItemsCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;
        // Create a new array to hold the unsold items
        MarketItem[] memory unsoldItems = new MarketItem[](unsoldItemsCount);
        for (uint256 i = 0; i < totalItemsCount; i++) {
            // If a market item does not have an owner (i.e. is not sold), then push to unsoldItems array
            if(idToMarketItem[i+1].owner == address(0)) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                unsoldItems[currentIndex] = currentItem;
                currentIndex+=1;
            }
        }
        return unsoldItems;
    }

    // Returns the NFTs purchased by the user
    function fetchMyNFTS() public view returns (MarketItem[] memory) {
        // Calculate the number of items that have not been sold
        uint totalItemsCount = _itemIds.current();
        uint itemsCount = 0;
        uint currentIndex = 0;
        // Count the number of items owned by creator
        for (uint256 i = 0; i < totalItemsCount; i++) {
            if(idToMarketItem[i+1].owner == msg.sender) {
                itemsCount += 1;
            }
        }
        // Create a new array to hold the owned items
        MarketItem[] memory myNFTs = new MarketItem[](itemsCount);
        for (uint256 i = 0; i < totalItemsCount; i++) {
            // If msg.sender is the owner of the NFT, then push to myNFTs array
            if(idToMarketItem[i+1].owner == msg.sender) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                myNFTs[currentIndex] = currentItem;
                currentIndex+=1;
            }
        }
        return myNFTs;
    }
    
    // Returns the NFTs created by the user
    function fetchNFTSCreated() public view returns (MarketItem[] memory) {
        // Calculate the number of items that have not been sold
        uint totalItemsCount = _itemIds.current();
        uint itemsCount = 0;
        uint currentIndex = 0;
        // Count the number of items on sale by creator
        for (uint256 i = 0; i < totalItemsCount; i++) {
            if(idToMarketItem[i+1].seller == msg.sender) {
                itemsCount += 1;
            }
        }
        // Create a new array to hold the unsold items
        MarketItem[] memory myNFTs = new MarketItem[](itemsCount);
        for (uint256 i = 0; i < totalItemsCount; i++) {
            // If a market item have seller as msg.sender, then push to myNFTs array
            if(idToMarketItem[i+1].seller == msg.sender) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                myNFTs[currentIndex] = currentItem;
                currentIndex+=1;
            }
        }
        return myNFTs;
    }
}