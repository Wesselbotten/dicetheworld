import { createThirdwebClient, getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "fallback-client-id";
// ZET HIER HET NIEUWE MARKETPLACE CONTRACTADRES NEER:
const contractAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || "0xJOUW_NIEUWE_MARKETPLACE_CONTRACT_ADRES";

export const client = createThirdwebClient({
  clientId: clientId,
});

export const marketplaceContract = getContract({
  client,
  chain: polygon,
  address: contractAddress,
});
