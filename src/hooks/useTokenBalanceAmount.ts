import { useBalance } from "wagmi";
import { Address, FetchBalanceArgs } from "@wagmi/core";
import { Amount } from "utils/amounts.utils";

type useTokenBalanceAmountArgs = Omit<FetchBalanceArgs, "token" | "address"> & {
  token: string | undefined;
  address: Address | undefined;
  watch?: boolean;
};

export function useTokenBalanceAmount(args: useTokenBalanceAmountArgs): Amount {
  const balanceRes = useBalance({ ...args, watch: true, token: args.token as `0x${string}` }).data;
  return Amount.fromBalanceResult(balanceRes);
}
