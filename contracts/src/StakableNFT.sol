// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.10;

// Import the ERC721 contract from the OpenZeppelin library
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// Define the StakableNFT contract that extends the ERC721 contract
contract StakableNFT is ERC721Enumerable {
    // Define the base URI for the NFT metadata
    string __baseURI;

    // Define a counter to keep track of minted tokens
    uint256 public count;

    // Events that will be emitted when a new token is minted or transferred
    event Mint(address to, uint256 tokenId);

    // Constructor for the contract
    constructor(
        string memory name, // Name of the NFT collection
        string memory symbol // Symbol of the NFT collection
    ) ERC721(name, symbol) {} // Pass the name and symbol to the parent contract

    // Function to mint a new token with a specific ID
    function mint(address to, uint256 tokenId) public payable {
        // Call the internal _safeMint function to create a new token
        _safeMint(to, tokenId);

        // Emit the Mint event
        emit Mint(to, tokenId);
    }

    // Function to mint a new token with an auto-incremented ID
    function mintTo(address to) public payable returns (uint256) {
        // Increment the token counter
        count++;

        // Call the internal _safeMint function to create a new token
        _safeMint(to, count);

        // Emit the Mint event
        emit Mint(to, count);

        // Return the new token ID
        return count;
    }
}
