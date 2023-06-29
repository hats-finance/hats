import { BigNumber } from "ethers";
import { IVault } from "types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { erc20ABI, useContractWrite, useNetwork } from "wagmi";

export class TokenApproveAllowanceContract {
  /**
   * Returns a caller function to approve the vault to spend the user's staking token.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to give approval to spend the user's staking token
   */
  static hook = (vault: IVault) => {
    const { chain } = useNetwork();

    const allowedContractAddress = vault.version === "v1" ? vault.master.address : vault.id;

    const approveAllowance = useContractWrite({
      mode: "recklesslyUnprepared",
      address: vault.stakingToken as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
      // chainId: vault.chainId,
    });

    return {
      ...approveAllowance,
      send: async (allowedAmount: BigNumber) => {
        await switchNetworkAndValidate(chain!.id, vault.chainId as number);

        // [params]: allowedContract, allowedAmount
        return approveAllowance.write!({ recklesslySetUnpreparedArgs: [allowedContractAddress as `0x${string}`, allowedAmount] });
      },
    };
  };
}
