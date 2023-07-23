/**
 * Includes missing types from the Alchemy SDK.
 * See: https://github.com/alchemyplatform/alchemy-sdk-js/blob/81995828257aca5a9ee221403e6a9354ace4ccc7/src/internal/raw-interfaces.ts#L48
 */
import {
  BaseNftContract,
  Media,
  NftMetadata,
  NftTokenType,
  TokenUri,
} from "alchemy-sdk";
import {
  RawAcquiredAt,
  RawOpenSeaCollectionMetadata,
  RawSpamInfo,
} from "alchemy-sdk/dist/src/internal/raw-interfaces";

/**
 * Represents the token metadata information of an NFT object received from Alchemy.
 *
 * @internal
 */
interface RawNftTokenMetadata {
  tokenType: NftTokenType;
}

/**
 * Represents the ID information of an NFT object received from Alchemy.
 *
 * @internal
 */
interface RawNftId {
  tokenId: string;
  tokenMetadata?: RawNftTokenMetadata;
}

export type NftWithProof = {
  network: string;
  contractAddress: `0x${string}`;
  tokenId: number;
  merkleProof: string; // JSON stringified
};

/**
 * Represents an NFT object without metadata received from Alchemy.
 *
 * @internal
 */
export interface RawBaseNft {
  contract: BaseNftContract;
  id: RawNftId;
}

/**
 * Represents the contract address and metadata of an NFT object received from
 * Alchemy. This field is separated out since not all NFT API endpoints return a
 * contract field.
 *
 * @internal
 */
export interface RawNftContractMetadata {
  name?: string;
  symbol?: string;
  totalSupply?: string;
  tokenType?: NftTokenType;
  openSea?: RawOpenSeaCollectionMetadata;
  contractDeployer?: string;
  deployedBlockNumber?: number;
}

/**
 * Represents an NFT object along with its metadata received from Alchemy.
 *
 * @internal
 */
export interface RawNft extends RawBaseNft {
  title: string;
  description?: string | Array<string>;
  tokenUri?: TokenUri;
  media?: Media[];
  metadata?: NftMetadata;
  timeLastUpdated: string;
  error?: string;
  contractMetadata?: RawNftContractMetadata;
  spamInfo?: RawSpamInfo;
  acquiredAt?: RawAcquiredAt;
}
