import { formatUnits, parseUnits } from "@ethersproject/units";
import { HATAirdropFactory_abi, HATToken_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { hexlify } from "ethers/lib/utils.js";
import { useState } from "react";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { readContract } from "wagmi/actions";
import { DropData } from "../types";
import { AirdropEligibility } from "../utils/getAirdropEligibility";
import { getAirdropMerkelTree, hashToken } from "../utils/getAirdropMerkelTree";
import { generateDelegationSig } from "./getDelegationSignature";

export class RedeemMultipleAirdropsContract {
  /**
   * Returns a caller function to redeem airdrop.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static hook = (
    airdrops: DropData[],
    airdropsEligibility: (AirdropEligibility | false | undefined)[],
    factory: string,
    chainId: number
  ) => {
    const [isCollectingDelegationSig, setIsCollectingDelegationSig] = useState(false);

    const { address: account } = useAccount();
    const { chain: connectedChain } = useNetwork();

    const redeemAirdrops = useContractWrite({
      mode: "recklesslyUnprepared",
      address: factory as `0x${string}`,
      abi: HATAirdropFactory_abi,
      functionName: "redeemMultipleAirdrops",
    });

    const redeemAirdropsAndDelegate = useContractWrite({
      mode: "recklesslyUnprepared",
      address: factory as `0x${string}`,
      abi: HATAirdropFactory_abi,
      functionName: "redeemAndDelegateMultipleAirdrops",
    });

    return {
      data: redeemAirdrops.data ?? redeemAirdropsAndDelegate.data,
      isLoading: redeemAirdrops.isLoading || redeemAirdropsAndDelegate.isLoading,
      isCollectingDelegationSig,
      send: async (
        percentageToDeposit: number | undefined,
        vaultToDeposit: string | undefined,
        delegatee: string | "self" | undefined
      ) => {
        try {
          if (airdropsEligibility.some((eligibility) => !eligibility)) return;
          if (!account || !connectedChain) return;
          await switchNetworkAndValidate(connectedChain.id, chainId);

          const addresses = airdrops.map((airdrop) => airdrop.address as `0x${string}`);
          const amounts = airdropsEligibility.map((eligibility) =>
            !!eligibility ? BigNumber.from(eligibility.total) : BigNumber.from(0)
          );
          const proofsPromises = airdropsEligibility.map(async (eligibility, index) => {
            const merkelTree = await getAirdropMerkelTree(airdrops[index].descriptionData.merkeltree);
            const amount = !!eligibility ? BigNumber.from(eligibility.total) : BigNumber.from(0);
            const proof = merkelTree.getHexProof(hashToken(account, amount)) as `0x${string}`[];
            return proof;
          });
          const proofs = await Promise.all(proofsPromises);
          const vaults = airdrops.map((_) => (vaultToDeposit ?? 0x0000000000000000000000000000000000000000) as `0x${string}`);
          const deposits = airdropsEligibility.map((eligibility) => {
            if (!eligibility) return BigNumber.from(0);
            const total = +formatUnits(eligibility.total, 18);
            const toDeposit = percentageToDeposit ? percentageToDeposit * total : 0;
            return parseUnits(toDeposit.toString(), 18);
          });
          const minShares = airdrops.map((_) => BigNumber.from(0));

          if (!delegatee || delegatee === "self") {
            // No delegation flow
            return redeemAirdrops.write({
              recklesslySetUnpreparedArgs: [addresses, amounts, proofs, vaults, deposits, minShares],
            });
          } else {
            // With delegation flow
            setIsCollectingDelegationSig(true);
            const tokenAddress = airdrops[0].token;
            const nonce = await readContract({
              address: tokenAddress as `0x${string}`,
              abi: HATToken_abi,
              chainId,
              functionName: "nonces",
              args: [account],
            });

            const expiryDate = (new Date().getTime() / 1000 + 365 * 24 * 3600).toFixed(0);
            const expiry = BigNumber.from(expiryDate); // 1 year
            const { v, r, s } = await generateDelegationSig(account, chainId, tokenAddress, delegatee, expiry.toNumber());
            setIsCollectingDelegationSig(false);

            return redeemAirdropsAndDelegate.write({
              recklesslySetUnpreparedArgs: [
                addresses,
                amounts,
                proofs,
                vaults,
                deposits,
                minShares,
                delegatee as `0x${string}`,
                nonce,
                expiry,
                v,
                hexlify(r) as `0x${string}`,
                hexlify(s) as `0x${string}`,
              ],
            });
          }
        } catch (error) {
          setIsCollectingDelegationSig(false);
          console.log(error);
        }
      },
    };
  };
}
