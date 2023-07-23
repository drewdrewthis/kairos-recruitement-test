/**
 * This script is used to create dummy metadata for the stakable NFTs.
 * It makes a GET request to the Alchemy NFT API for each NFT and stores the
 * response in a JSON object. The JSON object is then written to a file.
 * The JSON object is used by the frontend to display the NFTs.
 */
import https from "https";
import fs, { WriteFileOptions } from "fs";
import { promisify } from "util";

// Use promisify to convert fs.writeFile into a promise-based function
const writeFileAsync = promisify(fs.writeFile);

// Check for presence of API_KEY environment variable
if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("Missing API_KEY environment variable");
}

// Set the contract addresses
const addresses: { [key: string]: string } = {
  STAKABLE_NFT_ADDRESS1: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB", // CryptoPunks
  STAKABLE_NFT_ADDRESS2: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", // Bored Ape Yacht Club
  STAKABLE_NFT_ADDRESS3: "0x231d3559aa848Bf10366fB9868590F01d34bF240", // Valhalla
};

// The JSON object that will store the results
const resultJson: { [key: string]: any } = {};

// Function to make the GET request
async function getData(contractAddress: string): Promise<any> {
  const url = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.ALCHEMY_API_KEY}/getContractMetadata?contractAddress=${contractAddress}`;

  return new Promise<any>((resolve, reject) => {
    https.get(url, (resp) => {
      let data = "";

      // A chunk of data has been received
      resp.on("data", (chunk: Buffer) => {
        console.log(`Received ${chunk.length} bytes of data.`);
        data += chunk;
      });

      // The whole response has been received
      resp.on("end", () => {
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
  for (const key in addresses) {
    const contractAddress = addresses[key];
    let response = await getData(contractAddress);

    // Handle potential errors in response
    if (response.error && response.error.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      response = await getData(contractAddress); // retry after delay
    }

    // Add the metadata to the JSON object
    resultJson[`${contractAddress}`] = response;
  }

  // Write the JSON object to a file
  const options: WriteFileOptions = { encoding: "utf8" };
  await writeFileAsync(
    "src/contract-metadata.json",
    JSON.stringify(resultJson, null, 2),
    options
  );

  console.log("Data written to file");
}

// Call the main function
main().catch((err: Error) => console.error(err));
