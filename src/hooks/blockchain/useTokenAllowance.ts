import { BigNumber } from "ethers";
import { erc20ABI, useContractRead } from "wagmi";
import { useTabFocus } from "../useTabFocus";

type UseTokenAllowanceParamsType = { chainId?: number };

export const getTokenAllowanceContractInfo = (
  tokenAddress: string | undefined,
  ownerAddress: string | undefined,
  spenderAddress: string | undefined
) => {
  return {
    address: tokenAddress,
    abi: erc20ABI as any,
    functionName: "allowance",
    args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
  };
};

export function useTokenAllowance(
  tokenAddress: string | undefined,
  ownerAddress: string | undefined,
  spenderAddress: string | undefined,
  params?: UseTokenAllowanceParamsType
) {
  const isTabFocused = useTabFocus();

  const { data } = useContractRead({
    enabled: isTabFocused,
    ...getTokenAllowanceContractInfo(tokenAddress, ownerAddress, spenderAddress),
    ...params,
  });

  return data as BigNumber | undefined;
}
