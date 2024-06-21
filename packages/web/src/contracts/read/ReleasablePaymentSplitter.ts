import { HATPaymentSplitter_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { IVault } from "types";
import { useContractRead } from "wagmi";

export class ReleasablePaymentSplitter {
  /**
   * Returns the amount of shares the user has in the split contract
   *
   * @param vault - The selected vault from the payout
   * @param splitContractAddress - The address of the HATPaymentSplitter (where the payout prize is)
   * @returns The user shares amount
   */
  static hook = (vault: IVault, splitContractAddress: string | undefined, account: string | undefined): BigNumber => {
    const isTabFocused = useTabFocus();

    const res = useContractRead({
      address: splitContractAddress as `0x${string}` | undefined,
      abi: HATPaymentSplitter_abi,
      functionName: "releasable",
      chainId: vault?.chainId,
      args: [vault.stakingToken as `0x${string}`, account as `0x${string}`],
      enabled: isTabFocused,
      scopeKey: "hats",
      watch: isTabFocused,
    });

    return res.data ?? BigNumber.from(0);
  };
}
