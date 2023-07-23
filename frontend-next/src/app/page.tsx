"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { withController } from "../lib/utils/withController";
import { Chain, useAccount, useNetwork } from "wagmi";
import TabbedPanels from "../components/ui/TabbedPanels";
import MintPanel from "./home/panels/MintPanel";
import NoSSRWrapper from "../components/wrappers/NoSSRWrapper";
import StakedPanel from "./home/panels/StakedPanel";
import { goerli } from "viem/chains";

const Home = (props: ReturnType<typeof useController>) => {
  const { isConnected, chain, address } = props;

  return (
    <div className="h-full flex flex-col justify-between min-h-screen w-screen">
      <main className="flex flex-col items-center h-full text-white px-10 mb-10">
        <h1 className="text-7xl text-center m-0 mt-10">
          Kairos NFT Staking App
        </h1>
        <p>Where all of your dreams come true!</p>
        <NoSSRWrapper>
          <div className="mb-5">
            <ConnectButton />
          </div>
          {chain?.id === goerli.id && (
            <div className="mb-10 text-center">
              <p className="mb-1">Slow updates?</p>
              <a href={getExplorerPendingLink(chain, address)} target="_blank">
                Check your pending transactions
              </a>
            </div>
          )}
          {isConnected && (
            <div className="w-full">
              <TabbedPanels
                panels={[
                  {
                    label: "Unstaked NFTs",
                    content: <MintPanel />,
                  },
                  {
                    label: "Staked NFTs",
                    content: <StakedPanel />,
                  },
                ]}
              />
            </div>
          )}
        </NoSSRWrapper>
      </main>
      <footer className="mt-auto text-center p-10">
        <a
          href="https://github.com/drewdrewthis"
          rel="noopener noreferrer"
          target="_blank"
          className="text-white"
        >
          Made with ❤️ by drewdrewthis
        </a>
      </footer>
    </div>
  );
};

export default withController(Home, useController);

function useController() {
  const wagmi = useAccount();
  const { chain } = useNetwork();

  return {
    ...wagmi,
    chain,
  };
}

function getExplorerPendingLink(chain: Chain, walletAddress?: string) {
  if (!walletAddress) return "";

  switch (chain?.id) {
    case goerli.id:
      return `https://goerli.etherscan.io/txsPending?a=${walletAddress}&m=hf`;
    default:
      // Unsupported chain
      return "";
  }
}
