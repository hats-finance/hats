import { HATSVaultV1_abi, HATSVaultV2_abi } from "@hats-finance/shared";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types";
import { useAccount, useContractRead } from "wagmi";

export class WithdrawRequestInfoContract {
  static contractInfo = (vault?: IVault, account?: string | undefined) => {
    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;
    const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
    const method = vault?.version === "v1" ? "withdrawRequests" : "withdrawEnableStartTime";
    const args = vault?.version === "v1" ? [vault?.pid, account] : [account];

    return {
      address: vault ? (contractAddress as `0x${string}`) : undefined,
      abi: vaultAbi as any,
      functionName: method,
      chainId: vault?.chainId,
      args,
    };
  };

  static mapResponseToData = (res: any): BigNumber | undefined => {
    const data = res.data as any;

    let startTimeNumber: BigNumber | undefined = undefined;

    if (!res.isError && data) {
      startTimeNumber = data ?? undefined;
    }

    return startTimeNumber && !startTimeNumber.eq(0) ? startTimeNumber : undefined;
  };

  /**
   * Returns the starting time in seconds when the user can withdraw from the vault.
   *
   * @warning
   * This method is not being used because the value is being fetched from thegraph.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to get the user withdraw start time from
   * @returns The user withdraw start time
   */
  static hook = (vault: IVault): BigNumber | undefined => {
    const isTabFocused = useTabFocus();
    const { address: account } = useAccount();

    const res = useContractRead({
      ...this.contractInfo(vault, account),
      enabled: isTabFocused && !!account,
      scopeKey: "hats",
      watch: isTabFocused,
    });

    return this.mapResponseToData(res);
  };
}
