// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.10;

import "../src/NftStaking.sol";
import "forge-std/Vm.sol";
import "forge-std/console.sol";
import "ds-test/test.sol";
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import "../src/Merkle.sol";

contract TestNFT is ERC721 {
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function mint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
}

contract NftStakingTest is DSTest {
    using ECDSA for bytes32;
    Vm _vm = Vm(HEVM_ADDRESS);
    NftStaking _staking;
    IERC20 _rewardToken;
    uint256 internal _ownerPrivateKey;
    TestNFT _nftToken;

    address _owner;
    address _testUser;

    function setUp() public {
        _ownerPrivateKey = 0xabc123;
        _owner = _vm.addr(_ownerPrivateKey);

        _testUser = address(
            uint160(uint(keccak256(abi.encodePacked("user1"))))
        );

        console.log("owner: %s", _owner);
        console.log("testUser: %s", _testUser);

        // Initialize your contract with appropriate values here
        _vm.startPrank(_owner);
        _staking = new NftStaking();
        _nftToken = new TestNFT("Random Token", "RT"); // instantiate the NFT token
        console.log("Token address: %s", address(_nftToken));
        _vm.stopPrank();

        // Mint some NFTs
        _nftToken.mint(_testUser, 1);
        _nftToken.mint(_testUser, 2);

        // Approve the staking contract to transfer the NFTs
        _vm.prank(_testUser);
        _nftToken.setApprovalForAll(address(_staking), true);
    }

    function testStakeSingleNFT() public {
        // Initialize Merkle
        Merkle m = new Merkle();

        // Build leaves
        bytes32[] memory data = new bytes32[](2);
        data[0] = _staking.encodeNftMerkleLeaf(address(_nftToken), 1);
        data[1] = _staking.encodeNftMerkleLeaf(address(_nftToken), 2);

        // Get Root, Proof, and Verify
        bytes32 merkleRoot = m.getRoot(data);

        // Create a batch of NFTs
        NftStaking.BatchStakeItem[]
            memory items = new NftStaking.BatchStakeItem[](1);
        items[0] = NftStaking.BatchStakeItem({
            collection: address(_nftToken),
            tokenId: 2,
            merkleProof: m.getProof(data, 1)
        });

        // Simulate signing the digest
        bytes32 digest = _staking.getDigest(merkleRoot);

        (uint8 v, bytes32 r, bytes32 s) = _vm.sign(_ownerPrivateKey, digest);
        NftStaking.Signature memory signature = NftStaking.Signature(v, r, s);

        _vm.startPrank(_testUser);

        _staking.stakeNFTs(items, merkleRoot, signature);

        for (uint256 i = 0; i < items.length; i++) {
            assertTrue(
                _staking.stakedTokens(items[i].collection, items[i].tokenId) ==
                    address(_testUser)
            );
        }
        _vm.stopPrank();
    }

    function testStakeBatchNFTs() public {
        // Initialize Merkle
        Merkle m = new Merkle();

        // Build leaves
        bytes32[] memory data = new bytes32[](2);
        data[0] = _staking.encodeNftMerkleLeaf(address(_nftToken), 1);
        data[1] = _staking.encodeNftMerkleLeaf(address(_nftToken), 2);

        // Get Root, Proof, and Verify
        bytes32 merkleRoot = m.getRoot(data);

        // Create a batch of NFTs
        NftStaking.BatchStakeItem[]
            memory items = new NftStaking.BatchStakeItem[](2);
        items[0] = NftStaking.BatchStakeItem({
            collection: address(_nftToken),
            tokenId: 1,
            merkleProof: m.getProof(data, 0)
        });
        items[1] = NftStaking.BatchStakeItem({
            collection: address(_nftToken),
            tokenId: 2,
            merkleProof: m.getProof(data, 1)
        });

        // Simulate signing the digest
        bytes32 digest = _staking.getDigest(merkleRoot);

        (uint8 v, bytes32 r, bytes32 s) = _vm.sign(_ownerPrivateKey, digest);
        NftStaking.Signature memory signature = NftStaking.Signature(v, r, s);

        _vm.startPrank(_testUser);

        _staking.stakeNFTs(items, merkleRoot, signature);

        for (uint256 i = 0; i < items.length; i++) {
            assertTrue(
                _staking.stakedTokens(items[i].collection, items[i].tokenId) ==
                    address(_testUser)
            );
        }
        _vm.stopPrank();
    }

    function testUnstakeNFTs() public {
        // Create a batch of NFTs
        NftStaking.BatchUnstakeItem[]
            memory items = new NftStaking.BatchUnstakeItem[](2);
        items[0] = NftStaking.BatchUnstakeItem({
            collection: address(_nftToken),
            tokenId: 1
        });
        items[1] = NftStaking.BatchUnstakeItem({
            collection: address(_nftToken),
            tokenId: 2
        });

        // Stake the NFTs
        this.testStakeBatchNFTs();

        _vm.startPrank(_testUser);
        _staking.unstakeNFTs(items);

        for (uint256 i = 0; i < items.length; i++) {
            assert(
                _staking.stakedTokens(items[i].collection, items[i].tokenId) ==
                    address(0)
            );
        }
    }

    function toDynamicArray(
        bytes32[3] memory input
    ) public pure returns (bytes32[] memory) {
        bytes32[] memory output = new bytes32[](3);
        for (uint i = 0; i < 3; i++) {
            output[i] = input[i];
        }
        return output;
    }

    // String to bytes32
    function toBytes32(
        string memory source
    ) public pure returns (bytes32 result) {
        return bytes32(bytes(source));
    }
}
