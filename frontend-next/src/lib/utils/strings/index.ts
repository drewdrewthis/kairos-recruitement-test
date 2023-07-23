export * from "./formatWalletAddress";

export function normalizeWalletAddress(address: string) {
  return address.toLowerCase();
}
