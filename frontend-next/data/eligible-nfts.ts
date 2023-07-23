import { addresses } from "../src/configuration/contractDeployments";

const eligibleNfts = {
  [addresses.STAKABLE_NFT_ADDRESS1]: [1, 3, 5, 10, 11],
  [addresses.STAKABLE_NFT_ADDRESS2]: [2, 4, 6, 18, 19],
  [addresses.STAKABLE_NFT_ADDRESS3]: [3, 7, 8, 9],
};

export default eligibleNfts;
