import Image from "next/image";
import styles from "../styles.module.scss";
import cx from "classnames";
import { Cta } from "../Cta";
import { RawNft } from "@/types";
import React from "react";
import format from "date-fns/format";

interface NftCardInterface {
  nft: RawNft & { timestamp: number };
  stakable?: boolean;
  onCtaClick?: () => void;
  isActive?: boolean;
}

export function StakedNftCard(props: NftCardInterface) {
  const { nft, onCtaClick, isActive } = props;

  if (!nft || !nft.media) return null;

  return (
    <div
      className={cx(
        "text-white flex flex-col space-between text-center h-full"
      )}
    >
      <div className="text-center w-full px-9">
        <Image
          className={cx(styles.thumbnail, "h-32 bg-white rounded-lg")}
          src={nft.media[0]?.thumbnail || nft.media[0]?.gateway}
          alt="thumb"
          height={100}
          width={100}
        />
      </div>
      <div className="text-blue-500">
        <div className="text-blue-300">Staked on:</div>
        {format(new Date(nft.timestamp * 1000), "MM/dd/yyyy hh:mm:ss a")}
      </div>
      <div className="px-8">
        <div className="text-center w-full p-1">
          <div>{`#${nft.id.tokenId}`}</div>
        </div>
        {onCtaClick && (
          <Cta {...props} onClick={onCtaClick} isActive={isActive}>
            UNSTAKE
          </Cta>
        )}
      </div>
    </div>
  );
}
