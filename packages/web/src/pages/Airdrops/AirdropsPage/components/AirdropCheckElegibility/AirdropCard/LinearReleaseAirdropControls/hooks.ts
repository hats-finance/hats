import { HATTokenLock_abi, erc20_abi } from "@hats.finance/shared";
import { useQuery } from "@tanstack/react-query";
import { Amount } from "utils/amounts.utils";
import { getContract, getProvider } from "wagmi/actions";

export const useLinearReleaseAidropInfo = (addressToCheck: string, releaseContract: string | undefined, chainId: number) => {
  const getInfo = async () => {
    const provider = getProvider({ chainId });
    const tokenLockContract = getContract({
      abi: HATTokenLock_abi,
      address: releaseContract as `0x${string}`,
      signerOrProvider: provider,
    });

    const [amountPerPeriod, currentPeriod, totalPeriods, releasable, released, total, endTime, startTime, token] =
      await Promise.all([
        tokenLockContract.amountPerPeriod(),
        tokenLockContract.currentPeriod(),
        tokenLockContract.periods(),
        tokenLockContract.releasableAmount(),
        tokenLockContract.releasedAmount(),
        tokenLockContract.vestedAmount(),
        tokenLockContract.endTime(),
        tokenLockContract.startTime(),
        tokenLockContract.token(),
      ]);

    const tokenContract = getContract({
      abi: erc20_abi,
      address: token as `0x${string}`,
      signerOrProvider: provider,
    });

    const [decimals, symbol] = await Promise.all([tokenContract.decimals(), tokenContract.symbol()]);

    return {
      currentPeriod: +currentPeriod.toString(),
      totalPeriods: +totalPeriods.toString(),
      amountPerPeriod: new Amount(amountPerPeriod, decimals, symbol),
      releasable: new Amount(releasable, decimals, symbol),
      released: new Amount(released, decimals, symbol),
      total: new Amount(total, decimals, symbol),
      endTime: new Date(+endTime.toString() * 1000),
      startTime: new Date(+startTime.toString() * 1000),
      pending: new Amount(total.sub(released).sub(releasable), decimals, symbol),
      token: {
        address: token as `0x${string}`,
        decimals: +decimals.toString(),
        symbol,
      },
    };
  };

  return useQuery({
    queryKey: ["token-lock-info", releaseContract],
    queryFn: getInfo,
  });
};
