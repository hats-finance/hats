import { BigNumber } from "ethers";
import { IVault } from "types/types";
import { UserSharesPerVaultContract } from "./UserSharesPerVault";
import { UserBalancePerVaultContract } from "./UserBalancePerVault";

interface useUserSharesAndBalancePerVaultReturn {
  userSharesAvailable: BigNumber | undefined;
  userBalanceAvailable: BigNumber | undefined;
}

export class UserSharesAndBalancePerVaultContract {
  /**
   * Returns the amount of shares the user has and the value of those shares (balance) on staking token.
   *
   * @remarks
   * This method is supporting v1 and v2 vaults.
   *
   * @param vault - The selected vault to get the user shares from and the balance of those shares
   * @returns The user shares amount and the user balance
   */
  static hook = (vault: IVault): useUserSharesAndBalancePerVaultReturn => {
    const userSharesAvailable = UserSharesPerVaultContract.hook(vault);
    const userBalanceAvailable = UserBalancePerVaultContract.hook(vault, userSharesAvailable);

    return { userSharesAvailable, userBalanceAvailable };
  };
}
