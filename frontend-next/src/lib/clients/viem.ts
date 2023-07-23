import { createPublicClient, createWalletClient, custom, http } from "viem";
import { goerli } from "viem/chains";
import { ganache } from "@/configuration/local-chains";
import { getEnv } from "../utils/getEnv";

const testChain = getEnv("NEXT_PUBLIC_NETWORK");

export function getPublicClient() {
  checkUrlIsCorrect();
  return createPublicClient({
    chain: getChain(),
    transport: http(getEnv("NEXT_PUBLIC_RPC_URL")),
  });
}

export function getWalletClient() {
  return createWalletClient({
    chain: getChain(),
    // @ts-expect-error Ethereum is on the window
    transport: custom(window?.ethereum || {}),
  });
}

function getChain() {
  if (testChain === "goerli") {
    return goerli;
  } else if (testChain === "ganache") {
    return ganache;
  } else {
    throw new Error(
      "Invalid test chain specified. Network unavailable: " + testChain
    );
  }
}

function checkUrlIsCorrect() {
  if (testChain === "ganache") return;

  const url = getEnv("NEXT_PUBLIC_RPC_URL");
  // Check url contains the chain name
  if (!url.includes(testChain)) {
    throw new Error(
      "Invalid RPC URL specified. Network unavailable: " + testChain
    );
  }
}
