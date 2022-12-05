import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types/types";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";

export class UserBalancePerVaultContract {
  static contractInfo = (vault?: IVault, userSharesAvailable?: BigNumber) => {
    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;
    const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
    const method = vault?.version === "v1" ? "poolInfo" : "previewRedeem";
    const args = vault?.version === "v1" ? [vault?.pid] : [userSharesAvailable];

    return {
      address: vault ? contractAddress : undefined,
      abi: vaultAbi as any,
      functionName: method,
      chainId: vault?.chainId,
      args,
    };
  };

  static mapResponseToData = (res: any, vault: IVault, userSharesAvailable: BigNumber | undefined): BigNumber | undefined => {
    const data = res.data as any;

    let userBalanceAvailable: BigNumber | undefined = undefined;

    if (!res.isError && data) {
      if (vault.version === "v1") {
        const totalShares: BigNumber | undefined = data.totalUsersAmount;
        const totalBalance: BigNumber | undefined = data.balance;

        if (totalShares && totalBalance && userSharesAvailable) {
          if (!totalShares.eq(0)) {
            userBalanceAvailable = userSharesAvailable?.mul(totalBalance).div(totalShares);
          }
        }
      } else {
        userBalanceAvailable = data;
      }
    }

    return userBalanceAvailable;
  };

  /**
   * Returns the value of the shares has on staking token. This method needs the userSharesAvailable to be passed as argument.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to get the user shares value from.
   * @returns The user shares value
   */
  static hook = (vault: IVault, userSharesAvailable: BigNumber | undefined): BigNumber | undefined => {
    const isTabFocused = useTabFocus();

    const res = useContractRead({
      ...this.contractInfo(vault, userSharesAvailable ?? BigNumber.from(0)),
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
    });

    return this.mapResponseToData(res, vault, userSharesAvailable ?? BigNumber.from(0));
  };
}
