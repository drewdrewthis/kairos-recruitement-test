import Image from "next/image";
import styles from "../styles.module.scss";
import cx from "classnames";
import { Cta } from "../Cta";
import { NftWithMetadata } from "@/types";
import React from "react";

interface NftCardInterface {
  nft: NftWithMetadata;
  stakable?: boolean;
  onCtaClick?: () => void;
  isActive?: boolean;
}

export function NftCard(props: NftCardInterface) {
  const { nft, onCtaClick, isActive } = props;

  if (!nft || !nft.media) return null;

  return (
    <div
      className={cx(
        "text-white flex flex-col space-between text-center h-full"
      )}
    >
      <Image
        className={cx(
          styles.thumbnail,
          "h-32 bg-white rounded-lg",
          nft.tokenId > 20 && styles.colorize
        )}
        src={nft.media[0]?.thumbnail || nft.media[0]?.gateway}
        alt="thumb"
        height={100}
        width={100}
      />
      <div className="text-center w-full p-1">
        <div>{`#${nft.tokenId}`}</div>
      </div>
      {onCtaClick && (
        <Cta {...props} onClick={onCtaClick} isActive={isActive} />
      )}
    </div>
  );
}
