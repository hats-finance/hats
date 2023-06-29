import { BigNumber } from "ethers";
import { useTabFocus } from "hooks/useTabFocus";
import { erc20ABI, useContractRead } from "wagmi";

export class TokenAllowanceContract {
  static contractInfo = (
    tokenAddress: `0x${string}` | undefined,
    ownerAddress: string | undefined,
    spenderAddress: string | undefined,
    chainId: number | undefined
  ) => {
    return {
      address: tokenAddress,
      abi: erc20ABI as any,
      functionName: "allowance",
      chainId,
      args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
    };
  };

  static mapResponseToData = (res: any): BigNumber | undefined => {
    return res.data as BigNumber | undefined;
  };

  static hook = (
    tokenAddress: `0x${string}` | undefined,
    ownerAddress: string | undefined,
    spenderAddress: string | undefined,
    chainId: number | undefined
  ) => {
    const isTabFocused = useTabFocus();

    const res = useContractRead({
      ...this.contractInfo(tokenAddress, ownerAddress, spenderAddress, chainId),
      enabled: isTabFocused,
    });

    return this.mapResponseToData(res);
  };
}
