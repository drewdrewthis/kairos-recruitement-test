import { abis } from "./abis";
import { addresses } from "./addresses";

export const contracts = {
  stakableNft1: {
    abi: abis.stakableNft,
    address: addresses.STAKABLE_NFT_ADDRESS1,
  },
  stakableNft2: {
    abi: abis.stakableNft,
    address: addresses.STAKABLE_NFT_ADDRESS2,
  },
};
