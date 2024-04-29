import { HATSVaultV1_abi, HATSVaultV2_abi, HATSVaultV3_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useContractWrite, useNetwork } from "wagmi";

export class DepositContract {
  /**
   * Returns a caller function to deposit staking token to the vault.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to deposit staking token
   */
  static hook = (vault: IVault) => {
    const { address: account } = useAccount();
    const { chain } = useNetwork();

    const contractAddress = vault.version === "v1" ? vault.master.address : vault.id;
    const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : vault?.version === "v2" ? HATSVaultV2_abi : HATSVaultV3_abi;

    const deposit = useContractWrite({
      mode: "recklesslyUnprepared",
      address: contractAddress as `0x${string}`,
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

          if (vault?.version === "v3") {
            // [params]: asset, receiver
            return deposit.write!({ recklesslySetUnpreparedArgs: [amountInTokens, account] });
          } else if (vault?.version === "v2") {
            // [params]: asset, receiver
            return deposit.write!({ recklesslySetUnpreparedArgs: [amountInTokens, account] });
          } else {
            // [params]: pid, amount
            return deposit.write!({ recklesslySetUnpreparedArgs: [vault.pid, amountInTokens] });
          }
        } catch (error) {}
      },
    };
  };
}
