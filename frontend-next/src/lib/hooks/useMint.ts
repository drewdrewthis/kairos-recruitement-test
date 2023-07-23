import { type Address, useAccount } from "wagmi";
import _contract from "@/__generated/contracts/StakableNFT.json";
import { useState } from "react";
import { addresses } from "../../configuration/addresses";
import { useNfts } from "./useNfts";
import { useContractMethod } from "./useContractMethod";

const { abi } = _contract;

export function useMint() {
  const account = useAccount();
  const { refetch } = useNfts();
  const [randomNFT, setRandomNFT] = useState<Address>(pickRandomNftAddress());
  const { execute } = useContractMethod({
    address: randomNFT,
    abi,
    functionName: "mintTo",
    args: [account.address],
    messagePrefix: "Minting NFT",
    enabled: !!account?.address,
    onSuccess() {
      refetch();
    },
  });

  const mintRandom = () => {
    const randomNFTAddress = pickRandomNftAddress();
    setRandomNFT(randomNFTAddress);
    execute();
  };

  return {
    mint: execute,
    mintRandom,
  };
}

function pickRandomNftAddress() {
  return Object.values(addresses)[
    Math.floor(Math.random() * Object.values(addresses).length)
  ] as Address;
}
