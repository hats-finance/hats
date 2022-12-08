import { useEffect, useState } from "react";
import { IVault } from "types";
import { getRedeemableDepositTokens } from "./getRedeemableDepositTokens";
import { INFTTokenInfoRedeemed } from "./types";

export function useDepositTokens(vault: IVault, vaultRegistered?: boolean, tiers?: number, address?: string) {
  const [depositTokens, setDepositTokens] = useState<INFTTokenInfoRedeemed[]>();
  useEffect(() => {
    if (!vault || !tiers || !address || !vaultRegistered) return;

    const load = async () => {
      const redeemableDepositTokens = await getRedeemableDepositTokens(vault, tiers, address);
      setDepositTokens(redeemableDepositTokens);
    };
    load();
  }, [vault, tiers, address, vaultRegistered]);
  return depositTokens;
}
