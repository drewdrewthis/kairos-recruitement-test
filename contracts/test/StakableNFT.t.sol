// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.10;

import "ds-test/test.sol";
import "../src/StakableNFT.sol";
import "forge-std/Vm.sol";

contract StakableTest is DSTest {
    Vm _vm = Vm(HEVM_ADDRESS);
    StakableNFT _nftToken;
    address _owner;
    uint256 internal _ownerPrivateKey;

    function setUp() public {
        _ownerPrivateKey = 0xabc123;
        _owner = _vm.addr(_ownerPrivateKey);
        _nftToken = new StakableNFT("Random Token", "RT"); // instantiate the NFT token
    }

    // Test mintTo funciton
    function testMintTo() public {
        uint256 tokenId = _nftToken.mintTo(address(_owner));
        assertEq(tokenId, 1);
    }
}
