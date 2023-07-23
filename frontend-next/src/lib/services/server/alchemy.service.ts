// Github: https://github.com/alchemyplatform/alchemy-sdk-js
// Setup: npm install alchemy-sdk
import { Network, Alchemy } from "alchemy-sdk";
import { Service } from "typedi";

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: "demo", // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

@Service()
export class AlchemyService {
  alchemy = new Alchemy(settings);

  constructor() {}

  public async getNftMetaData(contractAddress: string, tokenId: string) {
    return this.alchemy.nft
      .getNftMetadata(contractAddress, tokenId, {})
      .then((res) => {
        console.log("AlchemyService: SUCCESS", { contractAddress, tokenId });
        return res;
      });
  }
}
