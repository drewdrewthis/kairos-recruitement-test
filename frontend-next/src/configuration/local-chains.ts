import { Chain } from "wagmi";
import { getEnv } from "@/lib/utils/getEnv";

export const ganache = {
  id: 1337,
  name: "Ganache",
  network: "ganache-test",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: [getEnv("NEXT_PUBLIC_RPC_URL")],
      webSocket: [getEnv("NEXT_PUBLIC_WS_RPC_URL")],
    },
    default: {
      http: [getEnv("NEXT_PUBLIC_RPC_URL")],
      webSocket: [getEnv("NEXT_PUBLIC_WS_RPC_URL")],
    },
  },
} as const satisfies Chain;
