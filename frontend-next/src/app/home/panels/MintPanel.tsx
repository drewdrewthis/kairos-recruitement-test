import { Button, CircularProgress } from "@mui/material";
import { useMint } from "@/lib/hooks/useMint";
import { useNfts } from "@/lib/hooks/useNfts";
import NftGrid from "@/components/ui/NftGrid";
import { NftCard } from "@/components/ui/cards/NftCard";
import groupBy from "lodash/fp/groupBy";
import sortBy from "lodash/fp/sortBy";
import { CollectionHeader } from "./CollectionHeader";
import { useEligibilityData } from "@/lib/hooks/useEligibilityData";
import { useStakeNft } from "@/lib/hooks/staking/useStake";
import { Address } from "@/types";

function MintPanel() {
  const { mintRandom } = useMint();
  const { nfts } = useNfts();
  const { tagWithEligibility, isLoading } = useEligibilityData();
  const eligibleNfts = tagWithEligibility(nfts);
  const grouped = groupBy("contract.address", eligibleNfts);
  const { toggleNft, checkIsSelected, stakeNfts, selectedNfts } = useStakeNft();

  if (isLoading) {
    return (
      <div className="text-center flex flex-col gap-4 place-content-center align-center items-center">
        <div>Loading..</div>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className="text-center flex flex-col gap-4">
      {!!nfts.length && <div className="text-2xl">Select NFTs to Stake</div>}
      <div className="flex content-center items-center align-center mx-auto mb-8 max-w-3xl w-full">
        <Button
          className="rounded-lg bg-green-700 text-white m-auto"
          variant="outlined"
          onClick={() => {
            mintRandom();
          }}
        >
          CLICK TO MINT RANDOM NFT 🪄 ✨
        </Button>
        {selectedNfts?.length > 0 && (
          <div className="flex gap-4 items-center content-center m-auto">
            <Button
              variant="contained"
              color="primary"
              className="rounded-lg"
              disabled={selectedNfts?.length === 0}
              onClick={stakeNfts}
            >
              STAKE {selectedNfts?.length} NFT
              {selectedNfts?.length > 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </div>
      <div className="max-w-screen-3xl m-auto flex flex-col gap-8">
        {Object.keys(grouped).map((key) => (
          <div key={key}>
            {grouped[key][0]?.contractMetadata && (
              <CollectionHeader
                className="mb-5"
                collection={grouped[key][0].contractMetadata}
              />
            )}
            <NftGrid>
              {sortBy((o) => Number(o.tokenId), grouped[key] || []).map(
                (nft) => {
                  const item = {
                    tokenId: nft.id.tokenId as string,
                    collection: nft.contract.address as Address,
                    merkleProof: nft.merkleProof,
                  };

                  return (
                    <NftCard
                      nft={nft}
                      key={nft.contract.address + nft.id.tokenId}
                      isActive={!!checkIsSelected(item)}
                      onCtaClick={() => {
                        if (!item.merkleProof) {
                          console.warn("No merkle proof for this nft", item);
                          return;
                        }
                        toggleNft(item);
                      }}
                      stakable={nft.isEligible}
                    />
                  );
                }
              )}
            </NftGrid>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MintPanel;
