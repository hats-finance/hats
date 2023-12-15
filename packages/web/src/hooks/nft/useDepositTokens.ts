import { useCallback, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { prepareWriteContract, writeContract } from "wagmi/actions";
import { HATVaultsNFT_abi } from "@hats.finance/shared";
import { appChains } from "settings";
import { NFTContractDataProxy } from "constants/constants";
import { IVault } from "types";
import { getDepositTokensWithRedeemState } from "./getRedeemableDepositTokens";
import { INFTTokenInfoRedeemed } from "./types";

export function useDepositTokens(vault: IVault, vaultNftRegistered?: boolean, tierFromShares?: number, account?: string) {
  const [availableNftsByDeposit, setAvailableNftsByDeposit] = useState<INFTTokenInfoRedeemed[]>([]);

  useEffect(() => {
    if (!vault || tierFromShares === undefined || !account || !vaultNftRegistered) return;

    const load = async () => {
      const redeemableDepositTokens = await getDepositTokensWithRedeemState(vault, tierFromShares, account);
      setAvailableNftsByDeposit(redeemableDepositTokens);
    };
    load();
  }, [vault, tierFromShares, account, vaultNftRegistered]);

  const proxyAddress = NFTContractDataProxy[vault.master.address]! as `0x${string}`;

  const redeem = useCallback(async () => {
    if (!availableNftsByDeposit || !availableNftsByDeposit.length) return;

    const nftInterface = new ethers.utils.Interface(HATVaultsNFT_abi);
    const nftContract = vault?.chainId ? appChains[vault.chainId].vaultsNFTContract : undefined;
    if (!nftContract) return;

    const config = await prepareWriteContract({
      address: nftContract as `0x${string}`,
      abi: HATVaultsNFT_abi,
      functionName: "redeemMultipleFromShares",
      args: [[proxyAddress], [BigNumber.from(vault?.pid)], account as `0x${string}`],
    });
    const { wait } = await writeContract(config);
    const tx = await wait();

    const currentRedeemedNfts: INFTTokenInfoRedeemed[] = availableNftsByDeposit
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

    setAvailableNftsByDeposit(
      availableNftsByDeposit.map(
        (depositToken) => currentRedeemedNfts.find((redeemedNft) => redeemedNft.tokenId.eq(depositToken.tokenId)) || depositToken
      )
    );

    return currentRedeemedNfts;
  }, [account, availableNftsByDeposit, proxyAddress, vault.chainId, vault?.pid]);

  return { availableNftsByDeposit, redeem };
}
