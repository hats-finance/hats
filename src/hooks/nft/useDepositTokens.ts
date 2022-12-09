import { prepareWriteContract, writeContract } from "@wagmi/core";
import { ChainsConfig } from "config/chains";
import { NFTContractDataProxy } from "constants/constants";
import { HATVaultsNFT_abi } from "data/abis/HATVaultsNFT_abi";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { IVault } from "types";
import { getDepositTokensWithRedeemState } from "./getRedeemableDepositTokens";
import { INFTTokenInfoRedeemed } from "./types";

export function useDepositTokens(vault: IVault, vaultNftRegistered?: boolean, tiers?: number, account?: string) {
  const [depositTokens, setDepositTokens] = useState<INFTTokenInfoRedeemed[]>([]);

  useEffect(() => {
    if (!vault || !tiers || !account || !vaultNftRegistered) return;

    const load = async () => {
      const redeemableDepositTokens = await getDepositTokensWithRedeemState(vault, tiers, account);
      setDepositTokens(redeemableDepositTokens);
    };
    load();
  }, [vault, tiers, account, vaultNftRegistered]);

  const proxyAddress = NFTContractDataProxy[vault.master.address]! as `0x${string}`;

  const redeem = useCallback(async () => {
    if (!depositTokens || !depositTokens.length) return;

    const nftInterface = new ethers.utils.Interface(HATVaultsNFT_abi);
    const nftContract = vault?.chainId ? ChainsConfig[vault.chainId].vaultsNFTContract : undefined;
    if (!nftContract) return;

    const config = await prepareWriteContract({
      address: nftContract,
      abi: HATVaultsNFT_abi,
      functionName: "redeemMultipleFromShares",
      args: [[proxyAddress], [BigNumber.from(vault?.pid)], account as `0x${string}`],
    });
    const { wait } = await writeContract(config);
    const tx = await wait();

    console.log("depositTokens", depositTokens);
    console.log("TX Redemed", tx);

    const currentRedeemedNfts: INFTTokenInfoRedeemed[] = depositTokens
      .filter((depositToken) =>
        tx?.logs.find((log) => {
          const parsedLog = nftInterface.parseLog(log);
          const tokenIdOnTx: BigNumber = parsedLog.args.id;
          const isTransferSingle = parsedLog.name === "TransferSingle";
          const isToActualUser = parsedLog.args.to === account;

          return tokenIdOnTx.eq(depositToken.tokenId) && isTransferSingle && isToActualUser;
        })
      )
      .map((token) => ({ ...token, isRedeemed: true }));

    setDepositTokens(
      depositTokens.map(
        (depositToken) => currentRedeemedNfts.find((redeemedNft) => redeemedNft.tokenId.eq(depositToken.tokenId)) || depositToken
      )
    );

    return currentRedeemedNfts;
  }, [account, depositTokens, proxyAddress, vault.chainId, vault?.pid]);

  return { depositTokens, redeem };
}
