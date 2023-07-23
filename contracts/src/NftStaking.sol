// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol";
import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/draft-EIP712.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title NFT Staking Contract
 * @author Your Name
 * @notice This contract allows users to stake their NFTs in batches and receive rewards.
 * @dev Utilizes OpenZeppelin contracts for secure, tested functionality, and the contract owner signs off on staking operations.
 */
contract NftStaking is IERC721Receiver, EIP712, ReentrancyGuard {
    using ECDSA for bytes32;

    // Owner of the contract
    address private _owner;
    uint256 private _networkid;

    /**
     * @notice Defines a batch item (NFT)
     * @dev Includes the address of the NFT collection, token ID and a merkle proof
     */
    struct BatchStakeItem {
        address collection;
        uint256 tokenId;
        bytes32[] merkleProof;
    }

    /**
     * @notice Defines a batch item (NFT)
     * @dev Includes the address of the NFT collection, token ID and a merkle proof
     */
    struct BatchUnstakeItem {
        address collection;
        uint256 tokenId;
    }

    /**
     * @notice Signature struct for EIP712
     * @dev Includes v, r, and s components of a signature
     */
    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    /**
     * @notice Mapping of collection to staked token IDs to the staker
     * @dev Used to track which tokens are staked and by whom
     */
    mapping(address => mapping(uint256 => address)) public stakedTokens;

    // EIP712 Domain Separator
    bytes32 private immutable _DOMAIN_SEPARATOR;

    // EIP712 type hashes
    bytes32 private constant _BATCH_TYPEHASH =
        keccak256("BatchStakeItem(address collection,uint256 tokenId)");

    // Events
    /**
     * @notice Emits when a user stakes an NFT
     * @dev Includes details of the staker, collection, and token
     */
    event Staked(
        address indexed staker,
        address indexed collection,
        uint256 indexed tokenId,
        uint256 timestamp
    );

    /**
     * @notice Emits when a user unstakes an NFT
     * @dev Includes details of the staker, collection, and token
     */
    event Unstaked(
        address indexed staker,
        address indexed collection,
        uint256 indexed tokenId,
        uint256 timestamp
    );

    constructor() EIP712("NftStaking", "1") {
        _owner = msg.sender;
        _DOMAIN_SEPARATOR = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    _BATCH_TYPEHASH,
                    keccak256(bytes("NftStaking")),
                    keccak256(bytes("1")),
                    _getChainId(),
                    address(this)
                )
            )
        );
    }

    /**
     * @notice Allows a user to stake a batch of NFTs
     * @dev Verifies the signature and the merkle proof for each item, and transfers NFT ownership to the contract
     * @param items An array of BatchStakeItem structs detailing each NFT to stake
     * @param merkleRoot The merkle root for the batch
     * @param signature The EIP712 signature from the owner
     */
    function stakeNFTs(
        BatchStakeItem[] calldata items,
        bytes32 merkleRoot,
        Signature calldata signature
    ) external nonReentrant {
        // Check that the signature is valid
        verifyOwnerSignature(merkleRoot, signature);

        // Iterate over all the items for staking
        for (uint256 i = 0; i < items.length; i++) {
            address contractAddress = items[i].collection;
            uint256 tokenId = items[i].tokenId;
            bytes32[] calldata merkelProof = items[i].merkleProof;

            // Verify that the item is eligible for staking
            verifyItemProof(contractAddress, tokenId, merkelProof, merkleRoot);

            // Transfer the NFT to the contract
            ERC721(items[i].collection).safeTransferFrom(
                msg.sender,
                address(this),
                items[i].tokenId
            );

            stakedTokens[items[i].collection][items[i].tokenId] = msg.sender;

            emit Staked(
                msg.sender,
                items[i].collection,
                items[i].tokenId,
                block.timestamp
            );
        }
    }

    /**
     * @notice Verifies that the given signature is from the owner
     * @dev Used to ensure the owner has approved the staking operation
     * @param message The signed message
     * @param signature The signature to verify
     */
    function verifyOwnerSignature(
        bytes32 message,
        Signature calldata signature
    ) public view {
        bytes32 digest = getDigest(message);
        address signer = digest.recover(signature.v, signature.r, signature.s);

        require(
            signer != address(0) && signer == _owner,
            "Invalid signer: you are not the owner of the contract"
        );
    }

    /**
     * @notice Verifies the proof for an item to be staked
     * @dev Checks that the NFT is eligible for staking
     * @param contractAddress The contract address of the NFT collection
     * @param tokenId The token ID of the NFT
     * @param merkleProof The merkle proof for the item
     * @param merkleRoot The merkle root for the batch
     */
    function verifyItemProof(
        address contractAddress,
        uint256 tokenId,
        bytes32[] calldata merkleProof,
        bytes32 merkleRoot
    ) public view {
        bytes32 leaf = encodeNftMerkleLeaf(contractAddress, tokenId);

        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "This NFT is not eligible for staking"
        );
    }

    /**
     * @notice Encodes a merkle leaf for an NFT
     * @dev Used in constructing and verifying merkle proofs
     * @param contractAddress The contract address of the NFT collection
     * @param tokenId The token ID of the NFT
     * @return The encoded merkle leaf
     */
    function encodeNftMerkleLeaf(
        address contractAddress,
        uint256 tokenId
    ) public view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(_getChainId(), contractAddress, tokenId)
            );
    }

    /**
     * @notice Allows a user to unstake a batch of NFTs
     * @dev Ensures the caller is the original staker, and transfers NFT ownership back to the staker
     * @param items An array of BatchUnstakeItem structs detailing each NFT to unstake
     */
    function unstakeNFTs(
        BatchUnstakeItem[] calldata items
    ) external nonReentrant {
        // Loop over all the items and unstake them
        for (uint256 i = 0; i < items.length; i++) {
            // Ensure the caller is the original owner
            require(
                stakedTokens[items[i].collection][items[i].tokenId] ==
                    msg.sender,
                "Invalid unstake request: this token is not staked by you"
            );
            IERC721(items[i].collection).safeTransferFrom(
                address(this),
                msg.sender,
                items[i].tokenId
            );
            stakedTokens[items[i].collection][items[i].tokenId] = address(0);
            emit Unstaked(
                msg.sender,
                items[i].collection,
                items[i].tokenId,
                block.timestamp
            );
        }
    }

    // Signing functions
    function getDigest(bytes32 merkleRoot) public view returns (bytes32) {
        return _hashTypedDataV4(keccak256(abi.encodePacked(merkleRoot)));
    }

    /**
     * @notice Handles receipt of ERC721 tokens
     * @dev Returns the function selector to indicate successful receipt
     * @inheritdoc IERC721Receiver
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function _getChainId() internal view returns (uint256 chainId) {
        assembly {
            chainId := chainid()
        }
    }
}
