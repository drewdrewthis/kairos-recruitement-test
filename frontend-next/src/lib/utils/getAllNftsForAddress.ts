/**
 * When testing locally, we can't rely on Alchemy's fancy getNfts function,
 * so we can use this.
 */
import { Address } from "viem";
import { abis } from "../../configuration/abis";
import { addresses } from "../../configuration/contractDeployments";
import { Contract, ethers } from "ethers";
import { getEnv } from "./getEnv";
import { logger } from "../logging";

// Replace these with the actual contract address and the Ethereum node URL
const ethereumNodeURL = getEnv("NEXT_PUBLIC_RPC_URL");

const provider = new ethers.JsonRpcProvider(ethereumNodeURL);

const child = logger.child({
  module: "getAllNftsForAddress",
});

async function getAllNFTsOfAddressForContract(
  contract: Contract,
  walletAddress: Address,
  contractAddress: Address
) {
  try {
    child.info(
      {
        walletAddress,
      },
      "START: Fetching owned NFTs for walletAddress."
    );

    const balance = await contract.balanceOf(walletAddress);
    const nftIds = [];

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
      nftIds.push(Number(tokenId));
    }

    child.info(
      {
        walletAddress,
        contractAddress,
        nftIds,
      },
      "SUCCESS: Fetched owned NFTs for walletAddress."
    );

    return nftIds;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
}

export async function getAllNftsForAddress(ownerAddress: Address) {
  const _addresses = [
    addresses.STAKABLE_NFT_ADDRESS1,
    addresses.STAKABLE_NFT_ADDRESS2,
    addresses.STAKABLE_NFT_ADDRESS3,
  ];

  const dict = _addresses.reduce((acc, address) => {
    acc[address] = [];
    return acc;
  }, {} as Record<Address, number[]>);

  for (const address of _addresses) {
    const contract = new ethers.Contract(address, abis.stakableNft, provider);
    const nfts = await getAllNFTsOfAddressForContract(
      contract,
      ownerAddress,
      address
    );
    dict[address] = nfts;
  }

  return dict as Record<Address, number[]>;
}
