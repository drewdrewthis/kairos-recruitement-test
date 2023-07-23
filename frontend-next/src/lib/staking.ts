export async function fetchEligibiltyData() {
  const response = await fetch(`/api/nfts/eligibility-data`);
  const data = await response.json();
  return data;
}
