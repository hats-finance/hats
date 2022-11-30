import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { BigNumber } from "ethers";
import { IVault } from "types/types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";

/**
 * Returns a caller function to deposit staking token to the vault.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to deposit staking token
 */
export function useDeposit(vault: IVault) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
  const vaultAbi = vault.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;

  const deposit = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: vaultAbi as any,
    functionName: "deposit",
    // chainId: vault.chainId,
  });

  return {
    ...deposit,
    /**
     * Call the deposit function.
     * @param amountInTokens - The amount in TOKENS (not shares) to deposit
     */
    send: async (amountInTokens: BigNumber) => {
      try {
        await switchNetworkAndValidate(chain!.id, vault.chainId as number);

        if (vault?.version === "v2") {
          // [params]: asset, receiver
          return deposit.write!({ recklesslySetUnpreparedArgs: [amountInTokens, account] });
        } else {
          // [params]: pid, amount
          return deposit.write!({ recklesslySetUnpreparedArgs: [vault.pid, amountInTokens] });
        }
      } catch (error) {}
    },
  };
}
