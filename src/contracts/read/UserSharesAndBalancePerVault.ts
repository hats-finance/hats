import { useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types/types";
import { HATSVaultV1_abi } from "data/abis/HATSVaultV1_abi";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";
import { UserSharesPerVaultContract } from "./UserSharesPerVault";

interface useUserSharesAndBalancePerVaultReturn {
  userSharesAvailable: BigNumber | undefined;
  userBalanceAvailable: BigNumber | undefined;
}

export class UserSharesAndBalancePerVaultContract {
  static contractInfo = (vault?: IVault, userSharesAvailableCache?: BigNumber) => {
    const contractAddress = vault?.version === "v1" ? vault?.master.address : vault?.id;
    const vaultAbi = vault?.version === "v1" ? HATSVaultV1_abi : HATSVaultV2_abi;
    const method = vault?.version === "v1" ? "poolInfo" : "previewRedeem";
    const args = vault?.version === "v1" ? [vault?.pid] : [userSharesAvailableCache];

    return {
      address: vault ? contractAddress : undefined,
      abi: vaultAbi as any,
      functionName: method,
      chainId: vault?.chainId,
      args,
    };
  };

  static mapResponseToData = (
    res: any,
    vault: IVault,
    userSharesAvailable?: BigNumber
  ): useUserSharesAndBalancePerVaultReturn => {
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

    return { userSharesAvailable, userBalanceAvailable };
  };

  /**
   * Returns the amount of shares the user has and the value of those shares (balance) on staking token.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to get the user shares from and the balance of those shares
   * @returns The user shares amount and the user balance
   */
  static hook = (vault: IVault, userSharesAvailableCache?: BigNumber): useUserSharesAndBalancePerVaultReturn => {
    const isTabFocused = useTabFocus();

    // If we are receiving userSharesAvailable from function, we dont need to call the contract
    let userSharesAvailable = UserSharesPerVaultContract.hook(userSharesAvailableCache ? undefined : vault);
    userSharesAvailable = userSharesAvailableCache ?? userSharesAvailable;

    const res = useContractRead({
      ...this.contractInfo(vault, userSharesAvailable),
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
    });

    return this.mapResponseToData(res, vault, userSharesAvailable);
  };
}
