import { useQuery } from "@tanstack/react-query";
import { fetchStakedNfts } from "../nfts";
import { useAccount, useQueryClient } from "wagmi";
import { RawNft } from "../../types";

type StakedToken = {
  collection: string;
  tokenId: string;
  timestamp: number;
} & RawNft;

/**
 * Custom hook for getting the staked NFTs for the current address
 */
export function useStakedNfts() {
  const account = useAccount();
  const queryKey = ["stakedNfts", account?.address];
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery<StakedToken[]>({
    queryKey,
    queryFn: () => fetchStakedNfts(account?.address),
    enabled: !!account?.address,
  });

  return {
    stakedNfts: query?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey });
    },
  };
}
