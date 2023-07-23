import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { RawNftContractMetadata } from "@/types";

interface CollectionHeaderInterface {
  collection?: RawNftContractMetadata;
  className?: string;
}

export function CollectionHeader(props: CollectionHeaderInterface) {
  const { collection, className } = props;

  if (!collection) return null;

  return (
    <div
      className={twMerge(
        "flex gap-3 align-center items-center justify-center",
        className
      )}
    >
      {collection.openSea?.imageUrl && (
        <Image
          src={collection.openSea?.imageUrl}
          alt="collection-logo"
          height={50}
          width={50}
        />
      )}
      {collection.name}
    </div>
  );
}
