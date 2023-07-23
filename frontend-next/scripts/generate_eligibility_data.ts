import { Address, encodePacked, keccak256 } from "viem";
import eligibleNfts from "@/data/eligible-nfts";
import MerkleTree from "merkletreejs";
import { ecsign, toBuffer, toRpcSig } from "ethereumjs-util";
import fs, { WriteFileOptions } from "fs";
import { promisify } from "util";
import { NftWithProof } from "../src/types";
import { ethers } from "ethers";
import { getEnv } from "../src/lib/utils/getEnv";
import { addresses } from "../src/configuration/contractDeployments";
import stakingContract from "@/__generated/contracts/NftStaking.json";

// Use promisify to convert fs.writeFile into a promise-based function
const writeFileAsync = promisify(fs.writeFile);

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: `.env.local`,
});

if (!process.env.PRIVATE_KEY) {
  throw new Error("No private key provided");
}

interface Nft {
  contractAddress: string;
  tokenId: number;
}

const convertEligibleNftsToArray = (collections: typeof eligibleNfts) =>
  Object.entries(collections).flatMap(([contractAddress, tokenIds]) =>
    tokenIds.map((tokenId) => ({ contractAddress, tokenId }))
  ) as Nft[];

const createMerkleLeaves = (nfts: Nft[]) =>
  nfts.map((nft) => {
    const { contractAddress, tokenId } = nft;
    const network = getEnv("NEXT_PUBLIC_NETWORK");
    const chainId = network === "ganache" ? 1337 : 5;
    const encoded = encodePacked(
      ["uint256", "address", "uint256"],
      [
        BigInt(chainId),
        contractAddress.toLowerCase() as Address,
        BigInt(tokenId),
      ]
    );
    return keccak256(encoded);
  });

const addProofToNfts = (leaves: any, tree: any, nfts: Nft[]): NftWithProof[] =>
  leaves.map((leaf: any, idx: number) => {
    const proof = tree.getHexProof(leaf);
    return {
      ...nfts[idx],
      merkleProof: JSON.stringify(proof),
    };
  });

const getDigestFromContract = async (merkleRoot: any) => {
  try {
    const provider = new ethers.JsonRpcProvider(getEnv("NEXT_PUBLIC_RPC_URL"));
    const signer = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider
    );
    const contract = new ethers.Contract(
      addresses.STAKING_CONTRACT,
      stakingContract.abi,
      signer
    );

    return contract.getDigest(merkleRoot);
  } catch (e) {
    console.error("Error getting digest from contract", e);
  }
};

const signMerkleRoot = (merkleRoot: any) => {
  const parts = ecsign(toBuffer(merkleRoot), toBuffer(process.env.PRIVATE_KEY));
  return toRpcSig(parts.v, parts.r, parts.s);
};

const verifyProof = (
  tree: any,
  nftsWithProofs: any,
  leaves: `0x${string}`[],
  merkleRoot: any
) => {
  console.log("Verifying that everything works as expected");
  const proof = JSON.parse(nftsWithProofs[8].merkleProof);
  console.log("To prove:", nftsWithProofs[8]);
  console.log("Verified?:", tree.verify(proof, leaves[8], merkleRoot));
};

const main = async () => {
  const nfts = convertEligibleNftsToArray(eligibleNfts);

  const leaves = createMerkleLeaves(nfts);

  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  const merkleRoot = tree.getHexRoot();

  const digest = await getDigestFromContract(merkleRoot);

  const nftsWithProofs = addProofToNfts(leaves, tree, nfts);

  const signedMerkleRoot = signMerkleRoot(digest);

  verifyProof(tree, nftsWithProofs, leaves, merkleRoot);

  const timestamp = Date.now();
  const eligibilityData = {
    nftsWithProofs: nftsWithProofs,
    merkleRoot,
    signedMerkleRoot,
    timestamp,

    date: new Date().toISOString(),
  };

  // Write the JSON object to a file
  const options: WriteFileOptions = { encoding: "utf8" };
  await writeFileAsync(
    `data/eligibility-data.${getEnv("NEXT_PUBLIC_NETWORK")}.json`,
    JSON.stringify(eligibilityData, null, 2),
    options
  );

  console.log("Data written to file");
};

main().catch(console.error);
