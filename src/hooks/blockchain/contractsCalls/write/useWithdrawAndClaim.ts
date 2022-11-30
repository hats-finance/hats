import { useAccount, useContractRead, useContractWrite, useNetwork } from "wagmi";
import { BigNumber } from "ethers";
import { IVault } from "types/types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";

/**
 * Returns a caller function to withdraw the user's staking token and claim the available rewards
 * from the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to withdraw and claim the tokens from
 */
export function useWithdrawAndClaim(vault: IVault) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const contractFunctionName = vault.version === "v1" ? "withdraw" : "withdrawAndClaim";
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;

  const withdrawAndClaim = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: contractFunctionName,
    // chainId: vault.chainId,
  });

  const { data: res, isError } = useContractRead({
    address: vault.version === "v1" ? vault.master.address : undefined,
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
     * Call the withdrawAndClaim function.
     * @param amountInTokens - The amount in TOKENS (not shares) to withdraw
     */
    send: async (amountInTokens: BigNumber) => {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      if (vault?.version === "v2") {
        // [params]: assets (amount in tokens), receiver, owner
        return withdrawAndClaim.write!({ recklesslySetUnpreparedArgs: [amountInTokens, account, account] });
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
}
