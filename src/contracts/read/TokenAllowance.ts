import { BigNumber } from "ethers";
import { erc20ABI, useContractRead } from "wagmi";
import { useTabFocus } from "hooks/useTabFocus";

type UseTokenAllowanceParamsType = { chainId?: number };

export class TokenAllowanceContract {
  static contractInfo = (
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

  static mapResponseToData = (res: any): BigNumber | undefined => {
    return res.data as BigNumber | undefined;
  };

  static hook = (
    tokenAddress: string | undefined,
    ownerAddress: string | undefined,
    spenderAddress: string | undefined,
    params?: UseTokenAllowanceParamsType
  ) => {
    const isTabFocused = useTabFocus();

    const res = useContractRead({
      ...this.contractInfo(tokenAddress, ownerAddress, spenderAddress),
      enabled: isTabFocused,
      ...params,
    });

    return this.mapResponseToData(res);
  };
}
