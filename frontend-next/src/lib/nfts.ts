import { Address } from "@/types";
import { getPublicClient, getWalletClient } from "./clients/viem";
import nftContract from "@/__generated/contracts/StakableNFT.json";
import { addresses } from "../configuration/contractDeployments";
import { enqueueSnackbar } from "notistack";

export async function fetchNfts(walletAddress: Address) {
  const res = await fetch("/api/nfts/" + walletAddress);
  return await res.json();
}

export async function fetchStakedNfts(walletAddress?: Address) {
  if (!walletAddress) throw new Error("Wallet address is required");
  const res = await fetch("/api/staked-nfts/" + walletAddress);
  return await res.json();
}

export async function checkIsApproved(args: {
  owner: Address;
  item: {
    collection: Address;
  };
}) {
  const { owner, item } = args;
  const client = getPublicClient();
  return client
    .readContract({
      address: item.collection,
      abi: nftContract.abi,
      functionName: "isApprovedForAll",
      args: [owner, addresses.STAKING_CONTRACT],
    })
    .catch((err) => {
      console.log("Failed to verify approval", err);
      enqueueSnackbar(
        "Error checking if NFT is approved for transfer. See console for more details.",
        {
          variant: "error",
        }
      );
    });
}

export async function approveForTransfer(args: {
  owner: Address;
  item: {
    collection: Address;
  };
}) {
  const { owner, item } = args;
  const client = getWalletClient();
  return client
    .writeContract({
      address: item.collection,
      abi: nftContract.abi,
      functionName: "setApprovalForAll",
      args: [addresses.STAKING_CONTRACT, true],
      account: owner,
    })
    .catch((err) => {
      console.log("Failed to approve", err);
      enqueueSnackbar(
        "Error approving NFT for transfer. See console for more details.",
        {
          variant: "error",
        }
      );
    });
}
