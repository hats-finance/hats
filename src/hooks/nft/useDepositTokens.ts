import { ChainsConfig } from "config/chains";
import { NFTContractDataProxy } from "constants/constants";
import { DepositRedeeemContract } from "contracts/write/DepositRedeem";
import { HATVaultsNFT_abi } from "data/abis/HATVaultsNFT_abi";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { IVault } from "types";
import { useContractWrite } from "wagmi";
import { getRedeemableDepositTokens } from "./getRedeemableDepositTokens";
import { INFTTokenInfoRedeemed } from "./types";

export function useDepositTokens(vault: IVault, vaultNftRegistered?: boolean, tiers?: number, account?: string) {
  const [depositTokens, setDepositTokens] = useState<INFTTokenInfoRedeemed[]>();
  useEffect(() => {
    if (!vault || !tiers || !account || !vaultNftRegistered) return;

    const load = async () => {
      const redeemableDepositTokens = await getRedeemableDepositTokens(vault, tiers, account);
      setDepositTokens(redeemableDepositTokens);
    };
    load();
  }, [vault, tiers, account, vaultNftRegistered]);

  const proxyAddress = NFTContractDataProxy[vault.master.address]! as `0x${string}`;

  const redeemHook = useContractWrite({
    mode: "recklesslyUnprepared",
    address: vault?.chainId ? ChainsConfig[vault.chainId].vaultsNFTContract : undefined,
    abi: HATVaultsNFT_abi,
    functionName: "redeemMultipleFromShares",
    chainId: vault?.chainId,
    args: [[proxyAddress], [BigNumber.from(vault?.pid)], account as `0x${string}`],
  });

  const redeem = useCallback(async () => {
    if (!redeemHook?.write) return;
    if (!depositTokens || !depositTokens.length) return;
    redeemHook?.write();
    const tx = await redeemHook?.data?.wait();
    return depositTokens
      .filter((depositToken) => tx?.logs.find((log) => BigNumber.from(log.topics[3]).eq(depositToken.tokenId)))
      .map((token) => ({ ...token, isRedeemed: true }));
  }, [redeemHook, depositTokens]);
  return { depositTokens, redeem };
}
