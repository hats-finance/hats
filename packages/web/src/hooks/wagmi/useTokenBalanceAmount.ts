import { useBalance, Address } from "wagmi";
import { FetchBalanceArgs } from "wagmi/actions";
import { Amount } from "utils/amounts.utils";
import { useTabFocus } from "../useTabFocus";

type useTokenBalanceAmountArgs = Omit<FetchBalanceArgs, "token" | "address"> & {
  token: string | undefined;
  address: Address | undefined;
  watch?: boolean;
};

export function useTokenBalanceAmount(args: useTokenBalanceAmountArgs): Amount {
  const isTabFocused = useTabFocus();

  const balanceRes = useBalance({ ...args, enabled: isTabFocused, watch: true, token: args.token as `0x${string}` }).data;
  return Amount.fromBalanceResult(balanceRes);
}
