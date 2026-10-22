import { createThirdwebClient, getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "fallback-client-id";
const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "0x14ba701863A9734b17fB074bC27104D57B644f8E";

export const client = createThirdwebClient({
  clientId: clientId,
});

export const contract = getContract({
  client,
  chain: polygon,
  address: contractAddress,
});
