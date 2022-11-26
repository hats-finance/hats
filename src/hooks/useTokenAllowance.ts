import { BigNumber } from "ethers";
import { erc20ABI, useContractRead } from "wagmi";

type UseTokenAllowanceParamsType = { chainId?: number };

export function useTokenAllowance(
  tokenAddress: string | undefined,
  ownerAddress: string | undefined,
  spenderAddress: string | undefined,
  params?: UseTokenAllowanceParamsType
) {
  const { data } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
    ...params,
  });

  return data as BigNumber | undefined;
}
