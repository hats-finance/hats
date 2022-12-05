import { ChainsConfig } from "config/chains";
import { getDepositTokens } from "./getDepositTokens";
import { getNftContract } from "./getNftContract";
import { getRedeemedState } from "./getRedeemedState";
import { getStakerData } from "./getStakerData";
import { INFTTokenInfo, INFTTokenInfoRedeemed } from "./types";

export async function getDepositTokensForAllChains(address: string): Promise<INFTTokenInfoRedeemed[] | undefined> {
  const allChainsTokens = await Promise.all(
    Object.keys(ChainsConfig).map(async (chainIdString): Promise<INFTTokenInfo[] | undefined> => {
      const chainId = Number(chainIdString);
      const nftContract = await getNftContract(chainId);
      if (!nftContract) return;
      const stakerData = await getStakerData(chainId, address);
      const depositTokens = await getDepositTokens(
        stakerData.map((staker) => ({ chainId, pid: staker.pid, masterAddress: staker.master.address })),
        nftContract,
        address
      );
      if (!depositTokens || !depositTokens.length) return;
      const withChainId = depositTokens.map((token) => ({ ...token, chainId: Number(chainId) } as INFTTokenInfo));
      return await getRedeemedState(address, chainId, nftContract, withChainId);
    })
  );
  const withoutEmpty = allChainsTokens.filter((tokens) => tokens?.length) as INFTTokenInfo[][];
  return withoutEmpty.flat() as INFTTokenInfoRedeemed[];
}
