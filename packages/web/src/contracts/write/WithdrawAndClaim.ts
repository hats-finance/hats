import { HATSVaultV1_abi, HATSVaultV2_abi, HATSVaultV3_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractRead, useContractWrite, useNetwork } from "wagmi";

export class WithdrawAndClaimContract {
  /**
   * Returns a caller function to withdraw the user's staking token and claim the available rewards
   * from the vault.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to withdraw and claim the tokens from
   */
  static hook = (vault: IVault) => {
    const { address: account } = useAccount();
    const { chain } = useNetwork();

    const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
    const contractFunctionName = vault.version === "v1" ? "withdraw" : "withdrawAndClaim";
    const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : vault?.version === "v2" ? HATSVaultV2_abi : HATSVaultV3_abi;

    const withdrawAndClaim = useContractWrite({
      mode: "recklesslyUnprepared",
      address: contractAddress as `0x${string}`,
      abi: vaultAbi as any,
      functionName: contractFunctionName,
      // chainId: vault.chainId,
    });

    // Separate withdraw function for fallback (v2/v3 only)
    const withdraw = useContractWrite({
      mode: "recklesslyUnprepared",
      address: (vault.version === "v2" || vault.version === "v3") ? (contractAddress as `0x${string}`) : undefined,
      abi: vaultAbi as any,
      functionName: "withdraw",
      // chainId: vault.chainId,
    });

    const { data: res, isError } = useContractRead({
      address: vault.version === "v1" ? (vault.master.address as `0x${string}`) : undefined,
      abi: HATSVaultV1_abi as any,
      functionName: "poolInfo",
      chainId: vault.chainId,
      scopeKey: "hats",
      args: [vault.pid],
    });
    const poolInfoData = res as any;

    return {
      ...withdrawAndClaim,
      // Merge data from both hooks - if fallback succeeds, use its data
      data: withdrawAndClaim.data || withdraw.data,
      // Only show error if primary failed AND fallback didn't succeed (no data from fallback)
      // If fallback succeeded, withdraw.data will exist, so don't show error
      error: (withdrawAndClaim.error && !withdraw.data) ? withdrawAndClaim.error : undefined,
      // Merge loading state
      isLoading: withdrawAndClaim.isLoading || withdraw.isLoading,
      /**
       * Call the withdrawAndClaim function, with fallback to withdraw if it fails.
       * @param amountInTokens - The amount in TOKENS (not shares) to withdraw
       */
      send: async (amountInTokens: BigNumber) => {
        if (!chain) {
          throw new Error("Wallet not connected or chain not available");
        }
        if (!account) {
          throw new Error("Wallet not connected");
        }
        
        await switchNetworkAndValidate(chain.id, vault.chainId as number);

        if (vault?.version === "v3") {
          // Try withdrawAndClaim first, fallback to withdraw if it fails
          // [params]: assets (amount in tokens), receiver, owner
          if (!withdrawAndClaim.writeAsync) {
            throw new Error("withdrawAndClaim.writeAsync is not available");
          }
          if (!withdraw.writeAsync) {
            throw new Error("withdraw.writeAsync is not available");
          }
          
          try {
            return await withdrawAndClaim.writeAsync({
              recklesslySetUnpreparedArgs: [amountInTokens, account, account],
            });
          } catch (error: any) {
            // Fallback to withdraw function
            return await withdraw.writeAsync({
              recklesslySetUnpreparedArgs: [amountInTokens, account, account],
            });
          }
        } else if (vault?.version === "v2") {
          // Try withdrawAndClaim first, fallback to withdraw if it fails
          // [params]: assets (amount in tokens), receiver, owner
          if (!withdrawAndClaim.writeAsync) {
            throw new Error("withdrawAndClaim.writeAsync is not available");
          }
          if (!withdraw.writeAsync) {
            throw new Error("withdraw.writeAsync is not available");
          }
          
          try {
            return await withdrawAndClaim.writeAsync({
              recklesslySetUnpreparedArgs: [amountInTokens, account, account],
            });
          } catch (error: any) {
            // Fallback to withdraw function
            return await withdraw.writeAsync({
              recklesslySetUnpreparedArgs: [amountInTokens, account, account],
            });
          }
        } else {
          const totalShares: BigNumber | undefined = poolInfoData?.totalUsersAmount;
          const totalBalance: BigNumber | undefined = poolInfoData?.balance;
          let amountInShares: BigNumber = BigNumber.from(0);

          if (totalShares && totalBalance && amountInTokens && !isError) {
            if (!totalShares.eq(0)) {
              amountInShares = amountInTokens?.mul(totalShares).div(totalBalance);
            }
          }

          // [params]: pid, shares (amount in shares)
          return withdrawAndClaim.write!({ recklesslySetUnpreparedArgs: [vault.pid, amountInShares] });
        }
      },
    };
  };
}
