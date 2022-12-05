import { BigNumber } from "ethers";
import { IVault } from "./../../../types/types";
import { useTabFocus } from "hooks/useTabFocus";
import { useAccount, useContractReads } from "wagmi";
import { TokenAllowanceContract } from "../TokenAllowance";
import { PendingRewardContract } from "../PendingReward";
import { UserSharesPerVaultContract } from "../UserSharesPerVault";

type DepositWithdrawDataMulticallReturn = {
  tokenAllowance: BigNumber | undefined;
  pendingReward: BigNumber | undefined;
  userSharesAvailable: BigNumber | undefined;
};

/**
 * This is a multicall with [tokenAllowance(1.), userShares(3.), pendingReward(5.)]. Used mainly on Deposit/Withdraw page.
 */
export class DepositWithdrawDataMulticall {
  static hook = (selectedVault: IVault): DepositWithdrawDataMulticallReturn => {
    const isTabFocused = useTabFocus();
    const { address: account } = useAccount();

    const contractAddress = selectedVault.version === "v1" ? selectedVault.master.address : selectedVault.id;
    const vaultToken = selectedVault.stakingToken;

    const { data: res, isError } = useContractReads({
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
      contracts: [
        TokenAllowanceContract.contractInfo(vaultToken, account, contractAddress, selectedVault.chainId),
        UserSharesPerVaultContract.contractInfo(selectedVault, account),
        PendingRewardContract.contractInfo(selectedVault, account),
      ],
    });
    const data = res as any;

    let dataToReturn = { pendingReward: undefined, tokenAllowance: undefined, userSharesAvailable: undefined };

    if (!isError && data) {
      if (selectedVault.version === "v1") {
        dataToReturn = { tokenAllowance: data?.[0], userSharesAvailable: data?.[1]?.[0], pendingReward: data?.[2] };
      } else {
        dataToReturn = { tokenAllowance: data?.[0], userSharesAvailable: data?.[1], pendingReward: data?.[2] };
      }
    }

    console.log(dataToReturn);
    return dataToReturn;
  };
}
