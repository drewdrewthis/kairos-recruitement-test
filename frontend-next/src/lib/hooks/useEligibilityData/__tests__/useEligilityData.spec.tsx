import { tagEligibleNfts } from "../utils";
import userNfts from "./userNfts.json";
import eligibilityData from "@/data/eligibility-data.ganache.json";

jest.mock("wagmi");

describe("findEligibileNfts", () => {
  it("should return 14 nfts", () => {
    const nfts = tagEligibleNfts({
      chain: "ganache-test",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userNfts: userNfts as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eligibilityDataForChain: eligibilityData.nftsWithProofs as any,
    });

    expect(nfts).toHaveLength(14);
  });
});
