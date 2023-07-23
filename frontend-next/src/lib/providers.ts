import { ethers } from "ethers";
import { getEnv } from "./utils/getEnv";

const ethereumNodeURL = getEnv("NEXT_PUBLIC_RPC_URL");
export const provider = new ethers.JsonRpcProvider(ethereumNodeURL);
