import { type Chain } from "wagmi";
import { NftWithMetadata, NftWithProof } from "@/types";
import { compareAddresses } from "../../utils";

/**
 * Filters the user's NFTs to only include those that are eligible for staking.
 */
export function tagEligibleNfts(args: {
  chain: Chain["network"];
  userNfts: NftWithMetadata[];
  eligibilityDataForChain: NftWithProof[];
}) {
  const { userNfts, eligibilityDataForChain } = args;

  const eligibleNfts = userNfts.map((nft) => {
    const { contract } = nft;

    const eligibleNft = eligibilityDataForChain.find(
      (merkledNft: NftWithProof) =>
        // TODO: Add support for multiple chains
        // merkledNft.network === chain &&
        compareAddresses(merkledNft.contractAddress, contract.address) &&
        merkledNft.tokenId.toString() === nft.id.tokenId
    );

    return {
      ...nft,
      isEligible: !!eligibleNft,
      merkleProof: eligibleNft ? JSON.parse(eligibleNft.merkleProof) : [],
    };
  });

  return eligibleNfts;
}
