import { Service } from "typedi";

@Service()
export class EligibiltyService {
  /**
   * Get all of the eligible NFTs for staking
   */
  async getEligibleNftData() {
    return import(
      `@/data/eligibility-data.${process.env.NEXT_PUBLIC_NETWORK}.json`
    );
  }
}
