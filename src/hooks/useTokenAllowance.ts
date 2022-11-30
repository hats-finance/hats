import { BigNumber } from "ethers";
import { erc20ABI, useContractRead } from "wagmi";
import { useTabFocus } from "./useTabFocus";

type UseTokenAllowanceParamsType = { chainId?: number };

export function useTokenAllowance(
  tokenAddress: string | undefined,
  ownerAddress: string | undefined,
  spenderAddress: string | undefined,
  params?: UseTokenAllowanceParamsType
) {
  const isTabFocused = useTabFocus();

  const { data } = useContractRead({
    enabled: isTabFocused,
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
    ...params,
  });

  return data as BigNumber | undefined;
}
