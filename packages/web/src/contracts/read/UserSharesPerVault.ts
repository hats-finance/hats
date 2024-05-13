import { HATSVaultV1_abi, HATSVaultV2_abi, HATSVaultV3_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types";
import { useAccount, useContractRead } from "wagmi";

export class UserSharesPerVaultContract {
  static contractInfo = (vault?: IVault, account?: string | undefined) => {
    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;
    const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : vault?.version === "v2" ? HATSVaultV2_abi : HATSVaultV3_abi;
    const method = vault?.version === "v1" ? "userInfo" : "balanceOf";
    const args = vault?.version === "v1" ? [vault?.pid, account] : [account];

    return {
      address: vault ? (contractAddress as `0x${string}`) : undefined,
      abi: vaultAbi as any,
      functionName: method,
      chainId: vault?.chainId,
      args,
    };
  };

  static mapResponseToData = (res: any, vault?: IVault): BigNumber => {
    const data = res.data as any;

    let userSharesAmount: BigNumber = BigNumber.from(0);

    if (!res.isError && data) {
      if (vault?.version === "v1") {
        userSharesAmount = data.amount ?? BigNumber.from(0);
      } else if (vault?.version === "v2") {
        userSharesAmount = data ?? BigNumber.from(0);
      } else if (vault?.version === "v3") {
        userSharesAmount = data ?? BigNumber.from(0);
      }
    }

    return userSharesAmount;
  };

  /**
   * Returns the amount of shares the user has on the vault.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to get the user shares from. If vault is undefined the call wont be executed.
   * @returns The user shares amount
   */
  static hook = (vault?: IVault): BigNumber => {
    const isTabFocused = useTabFocus();
    const { address: account } = useAccount();

    const res = useContractRead({
      ...this.contractInfo(vault, account),
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
    });

    return this.mapResponseToData(res, vault);
  };
}
