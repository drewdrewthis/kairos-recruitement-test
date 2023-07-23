import { Service } from "typedi";
import { getAllNftsForAddress } from "@/lib/utils/getAllNftsForAddress";
import { Address } from "viem";
import { spoofedAddresses } from "@/src/configuration/contractDeployments";
import fakeContractMeta from "@/data/contract-metadata.json";
import { NftWithMetadata, RawNft, RawNftContractMetadata } from "@/types";
import { getEnv } from "@/lib/utils/getEnv";

@Service()
export class NftService {
  public async getAllNftsForAddress(
    walletAddress: Address
  ): Promise<NftWithMetadata[]> {
    // We will use this when alchemy is not available. IE local dev
    const dict = await getAllNftsForAddress(walletAddress);
    const nfts = Object.entries(dict);
    const result = [];

    for (const [contractAddress, tokenIds] of nfts) {
      for (const tokenId of tokenIds) {
        const fakeId = getFakedTokenId(tokenId);

        const metadata = await this.getNftMetaData(
          contractAddress as Address,
          fakeId
        );

        if (!metadata) {
          throw new Error(
            "Could not find NFT metadata: " +
              JSON.stringify({ contractAddress, tokenIds: fakeId }) +
              ". You may need to run `yarn generate-metadata`"
          );
        }

        result.push({
          contractAddress: contractAddress as Address,
          tokenId,
          ...metadata,
        });
      }
    }

    return result;
  }

  /**
   * Get the metadata for a specific NFT.
   *
   * TODO: Standardize this interface so that it's not
   * dependent on the Alchemy SDK
   */
  async getNftMetaData(contractAddress: Address, tokenId: string | number) {
    const fakeMeta = await import(
      `@/data/nft-metadata.${getEnv("NEXT_PUBLIC_NETWORK")}.json`
    );

    return fakeMeta[
      `${contractAddress}:${getFakedTokenId(tokenId)}`.toLowerCase()
    ] as RawNft;
  }

  /**
   * Get the metadata for a specific contract
   *
   * TODO: Standardize this interface so that it's not
   * dependent on the Alchemy SDK
   */
  getContractMetaData(contractAddress: Address) {
    // We use a fake address so it's more fun
    const fakeAddress = spoofedAddresses[contractAddress];
    // @ts-expect-error We know this is valid
    return fakeContractMeta[fakeAddress] as RawNftContractMetadata;
  }
}

/**
 * We only have 20 spoofed NFTs, so we need to fake the tokenId
 * if we want to have more than 20 NFTs in the UI
 */
function getFakedTokenId(tokenId: number | string) {
  const fakeTokenId = Number(tokenId) % 20;
  return fakeTokenId === 0 ? 20 : fakeTokenId;
}
