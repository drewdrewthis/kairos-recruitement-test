/**
 * This script is used to create dummy metadata for the stakable NFTs.
 * It makes a GET request to the Alchemy NFT API for each NFT and stores the
 * response in a JSON object. The JSON object is then written to a file.
 * The JSON object is used by the frontend to display the NFTs.
 */
import https from "https";
import fs from "fs";
import { promisify } from "util";
import { IncomingMessage } from "http";
import { spoofedAddresses, addresses } from "../src/configuration/addresses";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: `.env.local`,
});

console.log(addresses);

// Use promisify to convert fs.writeFile into a promise-based function
const writeFileAsync = promisify(fs.writeFile);

// Check for presence of API_KEY environment variable
if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("Missing API_KEY environment variable");
}

// Function to make the GET request
async function getData(contractAddress: string, tokenId: number): Promise<any> {
  const url = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.ALCHEMY_API_KEY}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}`;

  return new Promise<any>((resolve, reject) => {
    https.get(url, (resp: IncomingMessage) => {
      let data = "";

      // A chunk of data has been received
      resp.on("data", (chunk) => {
        console.log(`Received ${chunk.length} bytes of data.`);
        data += chunk;
      });

      // The whole response has been received
      resp.on("end", () => {
        console.log(data);
        resolve(JSON.parse(data));
      });

      // Handle error
      resp.on("error", (err: Error) => {
        console.error("Error: " + err.message);
        reject(err);
      });
    });
  });
}

// Main function to process each address
async function main(): Promise<void> {
  // The JSON object that will store the results
  const resultJson: { [key: string]: any } = {};

  for (const contractAddress of Object.values(spoofedAddresses)) {
    for (let tokenId = 1; tokenId <= 20; tokenId++) {
      console.log(`Getting data for ${contractAddress}:${tokenId}`);
      let response = await getData(contractAddress, tokenId);

      // Handle potential errors in response
      if (response.error && response.error.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        response = await getData(contractAddress, tokenId); // retry after delay
      }

      // Add the metadata to the JSON object
      resultJson[`${contractAddress}:${tokenId}`] = response;
    }
  }

  // Write the JSON object to a file
  await writeFileAsync(
    `data/nft-metadata.${process.env.NEXT_PUBLIC_NETWORK}.json`,
    JSON.stringify(resultJson, null, 2)
      .replaceAll(
        spoofedAddresses[addresses.STAKABLE_NFT_ADDRESS1],
        addresses.STAKABLE_NFT_ADDRESS1
      )
      .replaceAll(
        spoofedAddresses[addresses.STAKABLE_NFT_ADDRESS2],
        addresses.STAKABLE_NFT_ADDRESS2
      )
      .replaceAll(
        spoofedAddresses[addresses.STAKABLE_NFT_ADDRESS3],
        addresses.STAKABLE_NFT_ADDRESS3
      )
  );

  console.log("Data written to file");
}

// Call the main function
main().catch((err: Error) => console.error(err));
