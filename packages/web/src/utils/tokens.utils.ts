import { fetchToken } from "wagmi/actions";

export const getTokenInfo = async (
  address: string,
  chainId: number | undefined
): Promise<{ isValidToken: boolean; name: string; symbol: string }> => {
  try {
    if (!chainId) throw new Error("Please provide chainId");

    const tokenInStorage = JSON.parse(sessionStorage.getItem(`tokenInfo-${chainId}-${address}`) ?? "null");
    const data = tokenInStorage ?? (await fetchToken({ address: address as `0x${string}`, chainId: +chainId }));
    sessionStorage.setItem(`tokenInfo-${chainId}-${address}`, JSON.stringify(data));

    if (!data) throw new Error("No data");

    return {
      isValidToken: data.isValidToken ?? true,
      name: data.name,
      symbol: data.symbol,
    };
  } catch (error) {
    const defaultData = {
      isValidToken: false,
      name: "",
      symbol: "",
    };

    sessionStorage.setItem(`tokenInfo-${chainId}-${address}`, JSON.stringify(defaultData));
    return defaultData;
  }
};
