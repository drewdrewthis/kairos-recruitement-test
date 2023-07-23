import "reflect-metadata";
import { Address } from "viem";
import { NftService } from "@/src/lib/services/server/nft.service";
import Container from "typedi";

interface IRequest {
  params: {
    walletAddress: string;
  };
}

// Define the GET method
export async function GET(
  _request: Request,
  context: IRequest
): Promise<Response> {
  // Destructure wallet address from request parameters
  const { walletAddress } = context.params;

  try {
    // Validate walletAddress is in correct format if there's a specific format
    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "Wallet address is required" }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const service = Container.get(NftService);

    // Attempt to retrieve all NFTs for the given wallet address
    const nfts = await service.getAllNftsForAddress(walletAddress as Address);

    // Respond with the retrieved NFTs and a 200 status code
    return new Response(JSON.stringify(nfts), {
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
        error: "An error occurred while trying to retrieve the NFTs",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
