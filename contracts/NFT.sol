// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

// Open source contracts which follow the ERC721 NFT standard
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    // Make the contract belong to the marketplace
    constructor(address marketplace) ERC721("MetaVerse","METI") {
        contractAddress = marketplace;
    }

    function createNFT(string memory tokenURI) public returns(uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // Mint the NFT and make the creator the owner of the NFT
        _mint(msg.sender, newItemId);
        // Set's tokenUI as the unique location address for the NFT
        _setTokenURI(newItemId, tokenURI);
        // Approve marketplace to sell the NFT on creator's behalf
        setApprovalForAll(contractAddress,true);
        return newItemId;
    }
}
