import { type Address, useAccount, useContractRead } from "wagmi";
import nftContract from "@/__generated/contracts/StakableNFT.json";
import { useContractMethod } from "./useContractMethod";
import { addresses } from "@/src/configuration/contractDeployments";

/**
 * A custom hook that allow us to check if the user has approved
 * the staking contract to transfer their NFTs and also approve it.
 *
 * @deprecated This is no longer used. Please use the utils/nft module instead.
 */
export function useApproveTransfer(params: { address: Address }) {
  const { address } = params;
  const account = useAccount();

  const { data } = useContractRead({
    address,
    abi: nftContract.abi,
    enabled: !!account?.address,
    functionName: "isApprovedForAll",
    args: [account.address, addresses.STAKING_CONTRACT],
  });

  const { execute } = useContractMethod({
    address,
    abi: nftContract.abi,
    functionName: "setApprovalForAll",
    enabled: !!account?.address,
    args: [addresses.STAKING_CONTRACT, true],
    messagePrefix: "Approving NFT for transfer",
  });

  return {
    isApproved: data,
    approve: execute,
  };
}
