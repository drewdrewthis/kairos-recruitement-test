import { useNetwork } from "wagmi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEligibiltyData } from "../../staking";
import { useCallback } from "react";
import { NftWithMetadata, NftWithProof } from "../../../types";
import eligibilityData from "@/data/eligibility-data.goerli.json";
import { tagEligibleNfts } from "./utils";

/**
 * Custom hook for getting all of the NFTs for the current account.
 */
export function useEligibilityData() {
  const { chain } = useNetwork();
  const queryKey = ["eligibility-data"];

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery<typeof eligibilityData>({
    queryKey,
    queryFn: () => fetchEligibiltyData(),
  });

  const tagWithEligibility = useCallback(
    (nfts: NftWithMetadata[]) => {
      if (!chain || !query?.data) return [];
      const { nftsWithProofs } = query.data;
      const eligibleNfts = tagEligibleNfts({
        userNfts: nfts,
        eligibilityDataForChain: nftsWithProofs as NftWithProof[],
        chain: chain.network,
      });
      return eligibleNfts;
    },
    [query?.data, chain]
  );

  return {
    eligibilityData: query?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey });
    },
    tagWithEligibility,
  };
}
