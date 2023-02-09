import { writeContract } from "wagmi/actions";
import { ChainsConfig } from "config/chains";
import { INFTTokenInfo } from "./types";
import { HATVaultsNFT_abi } from "@hats-finance/shared";
import { NFTContractDataProxy } from "constants/constants";
import { getPidsWithAddresses } from "./utils";

export async function redeemDepositNfts(chainId: number, address: string, depositRedeemables: INFTTokenInfo[]) {
  const pidsWithAddresses = getPidsWithAddresses(depositRedeemables);
  const hatVaults = pidsWithAddresses.map((pidWA) => NFTContractDataProxy[pidWA.masterAddress.toLowerCase()]);
  const pids = pidsWithAddresses.map((pidWA) => pidWA.pid);

  const vaultsNFTContract = ChainsConfig[chainId].vaultsNFTContract;
  if (!vaultsNFTContract) return null;

  const response = await writeContract({
    mode: "recklesslyUnprepared",
    address: vaultsNFTContract as `0x${string}`,
    abi: HATVaultsNFT_abi as any,
    functionName: "redeemMultipleFromShares",
    args: [hatVaults, pids, address],
  });
  return await response.wait();
}
