import _contract from "@/__generated/contracts/NftStaking.json";
import { useState } from "react";
import { addresses } from "../../../configuration/contractDeployments";
import { Address } from "viem";
import { useContractMethod } from "../useContractMethod";
import { useStakedNfts } from "../useStakedNfts";
import { useNfts } from "../useNfts";
import { compareAddresses } from "../../utils";

const { abi } = _contract;

interface BatchUnstakeItem {
  collection: Address;
  tokenId: string;
}
export function useUnstakeNft() {
  const { refetch: refreshStaked } = useStakedNfts();
  const { refetch: refreshNfts } = useNfts();
  const [selectedNfts, setSelectedNfts] = useState<BatchUnstakeItem[]>([]);

  const { execute } = useContractMethod({
    address: addresses.STAKING_CONTRACT,
    abi,
    functionName: "unstakeNFTs",
    args: [selectedNfts],
    messagePrefix: "Unstaking NFTs",
    onSuccess() {
      refreshStaked();
      refreshNfts();
      setSelectedNfts([]);
    },
  });

  const findNft = (nft: BatchUnstakeItem) => {
    return selectedNfts.find(
      (n) =>
        n.tokenId === nft.tokenId &&
        compareAddresses(n.collection, nft.collection)
    );
  };

  return {
    selectedNfts: selectedNfts,
    unstakeNfts: async () => {
      return execute();
    },
    toggleNft: (nft: BatchUnstakeItem) => {
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
    checkIsSelected: (nft: BatchUnstakeItem) => {
      return !!findNft(nft);
    },
  };
}
