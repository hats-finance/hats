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
      /**
       * Call the withdrawAndClaim function, with fallback to withdraw if it fails.
       * @param amountInTokens - The amount in TOKENS (not shares) to withdraw
       */
      send: async (amountInTokens: BigNumber) => {
        await switchNetworkAndValidate(chain!.id, vault.chainId as number);

        if (vault?.version === "v3") {
          // Try withdrawAndClaim first, fallback to withdraw if it fails
          // [params]: assets (amount in tokens), receiver, owner
          if (!withdrawAndClaim.write) {
            throw new Error("withdrawAndClaim.write is not available");
          }
          
          // Try withdrawAndClaim first
          try {
            const result = withdrawAndClaim.write({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] }) as any;
            
            // Set up a timeout to check for errors and fallback if needed
            // This handles cases where the error is set in the hook state rather than promise rejection
            const fallbackTimeout = setTimeout(() => {
              if (withdrawAndClaim.error && withdraw.write && !withdraw.isLoading && !withdraw.data) {
                console.warn("withdrawAndClaim error detected after timeout, trying withdraw as fallback:", withdrawAndClaim.error);
                withdraw.write({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] });
              }
            }, 3000); // Wait 3 seconds for gas estimation to complete
            
            // Wrap in Promise.resolve to ensure we can catch rejections
            const promise = Promise.resolve(result).catch(async (error: any) => {
              clearTimeout(fallbackTimeout);
              console.warn("withdrawAndClaim promise rejected, trying withdraw as fallback:", error);
              // Fallback to withdraw function
              if (!withdraw.write) {
                throw error;
              }
              return withdraw.write({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] }) as any;
            });
            
            // Clear timeout if promise resolves successfully
            promise.then(() => clearTimeout(fallbackTimeout)).catch(() => clearTimeout(fallbackTimeout));
            
            return promise;
          } catch (error: any) {
            console.warn("withdrawAndClaim failed synchronously, trying withdraw as fallback:", error);
            // Fallback to withdraw function
            if (!withdraw.write) {
              throw error;
            }
            return withdraw.write({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] }) as any;
          }
        } else if (vault?.version === "v2") {
          // Try withdrawAndClaim first, fallback to withdraw if it fails
          // [params]: assets (amount in tokens), receiver, owner
          if (!withdrawAndClaim.write) {
            throw new Error("withdrawAndClaim.write is not available");
          }
          
          // Try withdrawAndClaim first
          try {
            const result = withdrawAndClaim.write({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] }) as any;
            
            // Set up a timeout to check for errors and fallback if needed
            const fallbackTimeout = setTimeout(() => {
              if (withdrawAndClaim.error && withdraw.write && !withdraw.isLoading && !withdraw.data) {
                console.warn("withdrawAndClaim error detected after timeout, trying withdraw as fallback:", withdrawAndClaim.error);
                withdraw.write({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] });
              }
            }, 3000); // Wait 3 seconds for gas estimation to complete
            
            // Wrap in Promise.resolve to ensure we can catch rejections
            const promise = Promise.resolve(result).catch(async (error: any) => {
              clearTimeout(fallbackTimeout);
              console.warn("withdrawAndClaim promise rejected, trying withdraw as fallback:", error);
              // Fallback to withdraw function
              if (!withdraw.write) {
                throw error;
              }
              return withdraw.write({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] }) as any;
            });
            
            // Clear timeout if promise resolves successfully
            promise.then(() => clearTimeout(fallbackTimeout)).catch(() => clearTimeout(fallbackTimeout));
            
            return promise;
          } catch (error: any) {
            console.warn("withdrawAndClaim failed synchronously, trying withdraw as fallback:", error);
            // Fallback to withdraw function
            if (!withdraw.write) {
              throw error;
            }
            return withdraw.write({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] }) as any;
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
