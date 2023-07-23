import { Address } from "viem";
import { getEnv } from "@/lib/utils/getEnv";

// TODO: All deployed contracts should be in this dictionary instead
export const CONTRACT_DEPLOYMENTS = {
  constants: {
    goerli: {
      NftStaking: {
        address: "0xa38c5eCf3602fCd9072E706A0FD2232B624204cb" as Address,
        deployedBlock: 9391180,
      },
    },
    ganache: {
      NftStaking: {
        address: "0x00Ff071eEe1Bcae721f60dFDA570b5B8B42E1ab8" as Address,
        deployedBlock: 0,
      },
    },
  },
};

const allAddresses = {
  goerli: {
    STAKABLE_NFT_ADDRESS1:
      "0x58B449674A489360C0e32D8A0C4625190c4E0097".toLowerCase() as Address,
    STAKABLE_NFT_ADDRESS2:
      "0xE4fa7406066e72e1B662D7E9F82745eC727062ae".toLowerCase() as Address,
    STAKABLE_NFT_ADDRESS3:
      "0x5b8c30F21d95C2459aE1aDaC15d92D7efBAaFf22".toLowerCase() as Address,
    STAKING_CONTRACT: CONTRACT_DEPLOYMENTS.constants.goerli.NftStaking.address,
  } as Record<string, Address>,

  ganache: {
    STAKABLE_NFT_ADDRESS1:
      "0xf129BBf2dc2adE88005fD3f6E7ad62eb238a3A98".toLowerCase() as Address,
    STAKABLE_NFT_ADDRESS2:
      "0x46Fa692953263F1E4e9D78d64fe7cC7a60456194".toLowerCase() as Address,
    STAKABLE_NFT_ADDRESS3:
      "0x3D950D4228Bb6b070F9336713dc3833F35895186".toLowerCase() as Address,
    STAKING_CONTRACT: CONTRACT_DEPLOYMENTS.constants.ganache.NftStaking.address,
  },
};

function getAddressForNetwork() {
  const network = getEnv("NEXT_PUBLIC_NETWORK");

  if (network === "goerli") {
    return allAddresses.goerli;
  } else if (network === "ganache") {
    return allAddresses.ganache;
  } else {
    throw new Error(`Unknown network: ${network}`);
  }
}

console.log(
  "Using addresses:",
  getEnv("NEXT_PUBLIC_NETWORK"),
  getAddressForNetwork()
);
export const addresses = getAddressForNetwork();

export const spoofedAddresses = {
  // CryptoPunks
  [addresses.STAKABLE_NFT_ADDRESS1]:
    "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB".toLowerCase(),
  // Bored Ape Yacht Club
  [addresses.STAKABLE_NFT_ADDRESS2]:
    "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D".toLowerCase(),
  // Valhalla
  [addresses.STAKABLE_NFT_ADDRESS3]:
    "0x231d3559aa848Bf10366fB9868590F01d34bF240".toLowerCase(),
};
