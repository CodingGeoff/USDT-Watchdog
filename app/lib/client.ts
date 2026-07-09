import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ||
  "https://rpc.ankr.com/eth";

export const ethClient = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL, {
    retryCount: 2,
    retryDelay: 500,
  }),
});

export const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
