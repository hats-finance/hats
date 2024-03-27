import { HATSVaultV1_abi, HATSVaultV2_abi, HATSVaultV3_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types";
import { useContractRead } from "wagmi";

export class SharesToBalancePerVaultContract {
  static contractInfo = (vault?: IVault, shares?: BigNumber) => {
    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;
    const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : vault?.version === "v2" ? HATSVaultV2_abi : HATSVaultV3_abi;
    const method = vault?.version === "v1" ? "poolInfo" : "previewRedeem";
    const args = vault?.version === "v1" ? [vault?.pid] : [shares];

    return {
      address: vault && shares ? (contractAddress as `0x${string}`) : undefined,
      abi: vaultAbi as any,
      functionName: method,
      chainId: vault?.chainId,
      args,
    };
  };

  static mapResponseToData = (res: any, vault: IVault, shares: BigNumber | undefined): BigNumber | undefined => {
    const data = res.data as any;

    let balanceAvailable: BigNumber | undefined = undefined;

    if (!res.isError && data) {
      if (vault.version === "v1") {
        const totalShares: BigNumber | undefined = data.totalUsersAmount;
        const totalBalance: BigNumber | undefined = data.balance;

        if (totalShares && totalBalance && shares) {
          if (!totalShares.eq(0)) {
            balanceAvailable = shares?.mul(totalBalance).div(totalShares);
          }
        }
      } else if (vault.version === "v2") {
        balanceAvailable = data;
      } else if (vault.version === "v3") {
        balanceAvailable = data;
      }
    }

    return balanceAvailable;
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
  static hook = (vault: IVault, shares: BigNumber | undefined): BigNumber | undefined => {
    const isTabFocused = useTabFocus();

    const res = useContractRead({
      ...this.contractInfo(vault, shares ?? BigNumber.from(0)),
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
    });

    return this.mapResponseToData(res, vault, shares ?? BigNumber.from(0));
  };
}
