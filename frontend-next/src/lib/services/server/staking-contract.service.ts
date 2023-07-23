import { Service } from "typedi";
import { addresses } from "../../../configuration/addresses";
import stakingContract from "@/__generated/contracts/NftStaking.json";
import { Address } from "viem";
import { getPublicClient } from "../../clients/viem";
import { NftService } from "./nft.service";
import orderBy from "lodash/fp/orderBy";

type StakingLog = {
  address: Address;
  blockHash: `0x${string}`;
  blockNumber: string;
  data: `0x${string}`;
  logIndex: number;
  removed: boolean;
  topics: `0x${string}`[];
  transactionHash: `0x${string}`;
  transactionIndex: number;
  args: {
    staker: Address;
    collection: Address;
    tokenId: string;
    timestamp: string;
  };
  eventName: "Staked" | "Unstaked";
};

/**
 * A service for interacting with the staking contract.
 */
@Service()
export class StakingContractService {
  constructor(private readonly nftService: NftService) {}

  async getStakedNftsForAddress(address: Address) {
    const stakelogArgsArr = await this.getAllStakeEventsForAddress(address);

    const unstakeLogs = await this.getAllUnstakeEventsForAddress(address);

    const stakedNfts = getCurrentlyStakedFromLogs([
      ...stakelogArgsArr,
      ...unstakeLogs,
    ]);

    return Promise.all(stakedNfts.map(this.enhanceNftsWithMetadata));
  }

  private async getAllStakeEventsForAddress(address: Address) {
    return this.getAllLogsFor({ address, eventName: "Staked" });
  }

  private async getAllUnstakeEventsForAddress(address: Address) {
    return this.getAllLogsFor({ address, eventName: "Unstaked" });
  }

  private async getAllLogsFor(args: { address: Address; eventName: string }) {
    const { address, eventName } = args;
    const abiItem = stakingContract.abi.find((item) => item.name === eventName);

    if (!abiItem) {
      throw new Error("Could not find Staked event in staking contract ABI");
    }

    const client = getPublicClient();
    const filter = await client.createEventFilter({
      event: {
        ...abiItem,
        type: "event",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      address: addresses.STAKING_CONTRACT,
      fromBlock: BigInt(0),
      args: {
        staker: address,
      },
    });

    return client.getFilterLogs({
      filter,
    }) as unknown as StakingLog[];
  }

  private enhanceNftsWithMetadata = async (nft: {
    collection: string;
    tokenId: string;
  }) => {
    const { collection, tokenId } = nft;

    const metadata = await this.nftService.getNftMetaData(
      collection as Address,
      tokenId
    );

    return {
      ...nft,
      ...metadata,
    };
  };
}

function getCurrentlyStakedFromLogs(logs: StakingLog[]) {
  return orderBy("blockNumber", "asc", logs).reduce((acc, log) => {
    const { collection, tokenId } = log.args;

    if (log.eventName === "Staked") {
      acc.push(log.args);
    } else {
      const index = acc.findIndex(
        (nft) => nft.collection === collection && nft.tokenId === tokenId
      );

      if (index !== -1) {
        acc.splice(index, 1);
      }
    }

    return acc;
  }, [] as StakingLog["args"][]);
}
