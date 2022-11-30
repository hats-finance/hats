import { useContractWrite, useNetwork } from "wagmi";
import { BigNumber } from "ethers";
import { IVault } from "types/types";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { erc20_abi } from "data/abis/erc20_abi";

/**
 * Returns a caller function to approve the vault to spend the user's staking token.
 *
 * @remarks
 * This method is supporting v1 and v2 vaults.
 *
 * @param vault - The selected vault to give approval to spend the user's staking token
 */
export function useTokenApproveAllowance(vault: IVault) {
  const { chain } = useNetwork();

  const allowedContractAddress = vault.version === "v1" ? vault.master.address : vault.id;

  const approveAllowance = useContractWrite({
    mode: "recklesslyUnprepared",
    address: vault.stakingToken,
    abi: erc20_abi as any,
    functionName: "approve",
    // chainId: vault.chainId,
  });

  return {
    ...approveAllowance,
    send: async (allowedAmount: BigNumber) => {
      await switchNetworkAndValidate(chain!.id, vault.chainId as number);

      // [params]: allowedContract, allowedAmount
      return approveAllowance.write!({ recklesslySetUnpreparedArgs: [allowedContractAddress, allowedAmount] });
    },
  };
}
