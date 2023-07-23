import NftGrid from "@/components/ui/NftGrid";
import groupBy from "lodash/fp/groupBy";
import { CollectionHeader } from "./CollectionHeader";
import { useUnstakeNft } from "@/lib/hooks/staking/useUnstake";
import { Button } from "@mui/material";
import { useStakedNfts } from "@/lib/hooks/useStakedNfts";
import { Address } from "@/types";
import { StakedNftCard } from "@/components/ui/cards/StakedNftCard";
import { CircularProgress } from "@mui/material";
import sortBy from "lodash/fp/sortBy";

function StakedPanel() {
  const { stakedNfts, isLoading } = useStakedNfts();
  const grouped = groupBy("collection", stakedNfts);
  const { toggleNft, selectedNfts, checkIsSelected, unstakeNfts } =
    useUnstakeNft();

  if (isLoading) {
    return (
      <div className="text-center flex flex-col gap-4 place-content-center align-center items-center">
        <div>Loading..</div>
        <CircularProgress color="secondary" />
      </div>
    );
  }
  if (stakedNfts.length === 0) {
    return (
      <div className="text-center text-2xl">
        You haven&rsquo;t staked any NFTs yet!
      </div>
    );
  }

  if (!stakedNfts.length) return null;

  return (
    <div className="text-center flex flex-col gap-4">
      <div className="flex gap-4 m-auto items-center content-center mb-8">
        <div className="text-2xl">Select NFTs to Unstake</div>
        {selectedNfts?.length > 0 && (
          <div className="flex gap-4 m-auto items-center content-center">
            <Button
              variant="contained"
              color="primary"
              className="rounded-lg"
              disabled={selectedNfts?.length === 0}
              onClick={unstakeNfts}
            >
              UNSTAKE {selectedNfts?.length} NFT
              {selectedNfts?.length > 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </div>
      <div className="max-w-screen-3xl m-auto flex flex-col gap-8">
        {Object.keys(grouped).map((key) => (
          <div key={key}>
            {grouped[key][0].contractMetadata && (
              <CollectionHeader
                className="mb-5"
                collection={grouped[key][0].contractMetadata}
              />
            )}
            <NftGrid>
              {sortBy((o) => Number(o.id.tokenId), grouped[key] || []).map(
                (nft) => {
                  const item = {
                    tokenId: nft.tokenId as string,
                    collection: nft.collection as Address,
                  };

                  return (
                    <StakedNftCard
                      nft={nft}
                      key={nft.contract.address + nft.id.tokenId}
                      isActive={!!checkIsSelected(item)}
                      onCtaClick={() => {
                        toggleNft(item);
                      }}
                      stakable
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

export default StakedPanel;
