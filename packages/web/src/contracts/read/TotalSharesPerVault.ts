import { HATSVaultV1_abi, HATSVaultV2_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types";
import { useContractRead } from "wagmi";

export class TotalSharesPerVaultContract {
  static contractInfo = (vault?: IVault) => {
    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;
    const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
    const method = vault?.version === "v1" ? "poolInfo" : "totalSupply";
    const args = vault?.version === "v1" ? [vault?.pid] : [];

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

    let totalSharesAmount: BigNumber = BigNumber.from(0);

    if (!res.isError && data) {
      if (vault?.version === "v1") {
        totalSharesAmount = data.totalUsersAmount ?? BigNumber.from(0);
      } else if (vault?.version === "v2") {
        totalSharesAmount = data ?? BigNumber.from(0);
      }
    }

    return totalSharesAmount;
  };

  /**
   * Returns the total amount of shares on the vault.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to get the total shares from
   * @returns The total shares amount
   */
  static hook = (vault?: IVault): BigNumber => {
    const isTabFocused = useTabFocus();

    const res = useContractRead({
      ...this.contractInfo(vault),
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
    });

    return this.mapResponseToData(res, vault);
  };
}
