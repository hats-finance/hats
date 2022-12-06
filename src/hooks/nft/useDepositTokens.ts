import { useCallback, useEffect, useState } from "react";
import { IDepositTokensData, INFTTokenInfoRedeemed, IVaultIdentifier } from "./types";
import { groupBy } from "./utils";
import { redeemDepositNfts } from "./redeemDeposit";
import { getDepositTokensForAllChains } from "./getDepositTokensForAllChains";

export function useDepositTokens(address?: string): IDepositTokensData {
  const [depositTokens, setDepositTokens] = useState<INFTTokenInfoRedeemed[] | undefined>();
  const depositRedeemables = depositTokens?.filter((token) => !token.isRedeemed);

  useEffect(() => {
    if (!address) return;
    const refresh = async () => {
      const depositTokens = await getDepositTokensForAllChains(address);
      setDepositTokens(depositTokens);
    };
    refresh();
  }, [address]);

  const redeem = useCallback(async (): Promise<INFTTokenInfoRedeemed[]> => {
    if (!address || !depositRedeemables) return [];

    const redeemAllChains = async () => {
      const byChainId = groupBy(depositRedeemables, "chainId");
      Object.keys(byChainId).forEach(async (chainId) => {
        const response = await redeemDepositNfts(Number(chainId), address, byChainId[chainId]);
        console.log("redeemDepositNfts response", response);
      });
    };
    redeemAllChains();
    return [];
  }, [address, depositRedeemables]);

  const afterDeposit = useCallback(async (vault: IVaultIdentifier): Promise<INFTTokenInfoRedeemed[]> => {
    return [];
  }, []);

  return {
    depositTokens,
    redeem,
    afterDeposit
  };
}
