import "reflect-metadata";
import Container from "typedi";
import { EligibiltyService } from "@/lib/services/server/eligibility.service";

// Define the GET method
export async function GET(_request: Request): Promise<Response> {
  try {
    const service = Container.get(EligibiltyService);

    // Attempt to retrieve all NFTs for the given wallet address
    const data = await service.getEligibleNftData();

    // Respond with the retrieved NFTs and a 200 status code
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    // Handle any errors that occurred while trying to retrieve the NFTs
    // You may want to add more specific error handling depending on the errors
    // getAllNftsForAddress could potentially throw
    console.error(error);

    return new Response(
      JSON.stringify({
        error:
          "An error occurred while trying to retrieve the eligibility data",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
