import { useAccount } from "wagmi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Address, NftWithMetadata } from "@/types";
import { fetchNfts } from "../nfts";

/**
 * Custom hook for getting all of the NFTs for the current account.
 */
export function useNfts() {
  const account = useAccount();
  const walletAddress = account?.address;
  const queryKey = ["nfts", walletAddress];

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({
    queryKey,
    queryFn: () => fetchNfts(walletAddress as Address),
    enabled: !!walletAddress,
  });

  return {
    nfts: (query?.data || []) as NftWithMetadata[],
    isLoading: query.isLoading,
    error: query.error,
    refetch: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey });
    },
  };
}
