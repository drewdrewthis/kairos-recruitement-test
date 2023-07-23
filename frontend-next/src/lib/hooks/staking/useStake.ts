import nftStakingContract from "@/__generated/contracts/NftStaking.json";
import { useEffect, useState } from "react";
import { addresses } from "../../../configuration/contractDeployments";
import { Address } from "viem";
import { useContractMethod } from "../useContractMethod";
import { fromRpcSig } from "ethereumjs-util";
import { useNfts } from "../useNfts";
import { approveForTransfer, checkIsApproved } from "../../nfts";
import { useAccount } from "wagmi";
import { compareAddresses } from "../../utils";
import { useEligibilityData } from "../useEligibilityData";

const { abi } = nftStakingContract;

interface BatchStakeItem {
  collection: Address;
  tokenId: string;
  merkleProof: string[];
}
type MerkleRoot = string;
interface StringSig {
  v: number;
  r: string;
  s: string;
}
export function useStakeNft() {
  const account = useAccount();
  const { refetch } = useNfts();
  const [selectedNfts, setSelectedNfts] = useState<BatchStakeItem[]>([]);
  const { eligibilityData } = useEligibilityData();

  const [args, setArgs] = useState<[BatchStakeItem[], MerkleRoot, StringSig]>([
    [],
    "",
    { v: 0, r: "", s: "" },
  ]);

  const { execute } = useContractMethod({
    address: addresses.STAKING_CONTRACT,
    abi,
    functionName: "stakeNFTs",
    args,
    enabled: !!account?.address && selectedNfts.length > 0 && !!eligibilityData,
    messagePrefix: `Staking ${selectedNfts.length} NFTs`,
    onSuccess() {
      refetch();
      setSelectedNfts([]);
    },
  });

  // Set args as we get all of the data
  useEffect(() => {
    args[0] = selectedNfts;
    if (!eligibilityData) return;

    args[1] = eligibilityData.merkleRoot;
    const sig = fromRpcSig(eligibilityData.signedMerkleRoot);
    args[2] = {
      v: sig.v,
      r: `0x${sig.r.toString("hex")}`,
      s: `0x${sig.s.toString("hex")}`,
    };

    setArgs(args);
  }, [args, selectedNfts, eligibilityData]);

  const findNft = (nft: BatchStakeItem) => {
    return selectedNfts.find(
      (n) =>
        n.tokenId === nft.tokenId &&
        compareAddresses(n.collection, nft.collection)
    );
  };

  return {
    selectedNfts,
    stakeNfts: async () => {
      if (!account) return;

      for (const nft of selectedNfts) {
        const isApproved = await checkIsApproved({
          owner: account.address as Address,
          item: nft,
        });

        if (!isApproved) {
          await approveForTransfer({
            owner: account.address as Address,
            item: nft,
          });
        }
      }

      if (selectedNfts.length > 0) {
        execute();
      }
    },
    toggleNft: (nft: BatchStakeItem) => {
      if (findNft(nft)) {
        setSelectedNfts(
          selectedNfts.filter(
            (n) =>
              n.tokenId !== nft.tokenId &&
              compareAddresses(n.collection, nft.collection)
          )
        );
      } else {
        setSelectedNfts([...selectedNfts, nft]);
      }
    },
    checkIsSelected: (nft: BatchStakeItem) => {
      return !!findNft(nft);
    },
  };
}
