import { type Address as ViemAddress } from "viem";
import { RawNft } from "./alchemy";
export type Address = `0x${string}` | ViemAddress;
export * from "./alchemy";

export type NftWithProof = {
  network: string;
  contractAddress: `0x${string}`;
  tokenId: number;
  merkleProof: string; // JSON stringified
};

export type NftWithMetadata = RawNft & {
  contractAddress: Address;
  tokenId: number;
};
