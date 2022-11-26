import { useBalance } from "wagmi";
import { Address, FetchBalanceArgs } from "@wagmi/core";
import { Amount } from "utils/amounts.utils";

type UseBalanceAmountArgs = Omit<FetchBalanceArgs, "token" | "address"> & {
  token: string | undefined;
  address: Address | undefined;
  watch?: boolean;
};

export function useBalanceAmount(args: UseBalanceAmountArgs): Amount {
  const balanceRes = useBalance({ ...args, token: args.token as `0x${string}` }).data;
  return Amount.fromBalanceResult(balanceRes);
}
