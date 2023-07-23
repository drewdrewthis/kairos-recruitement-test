"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ganache } from "@/configuration/local-chains";
import { getEnv } from "@/lib/utils/getEnv";

const testChain = getEnv("NEXT_PUBLIC_NETWORK");

const _chains: Chain[] = [mainnet];

class InvalidChainError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "InvalidChainError";
  }
}

/**
 * To prevent accidentally using the wrong test chain,
 * we force the user to specify the test chain in the .env.local file
 * and throw an error if the specified test chain is not available.
 */
if (testChain === "goerli") {
  _chains.push(goerli);
} else if (testChain === "ganache") {
  _chains.push(ganache);
} else {
  throw new InvalidChainError(
    "Invalid test chain specified. Network unavailable: " + testChain
  );
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  _chains,
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: getEnv("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID"),
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
