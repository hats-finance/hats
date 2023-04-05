import axios, { AxiosResponse } from "axios";
import { fetchToken } from "wagmi/actions";
import { TokenPriceResponse } from "@hats-finance/shared";
import { appChains } from "settings";
import { GET_PRICES_UNISWAP, IUniswapGetPricesResponse } from "graphql/uniswap";

const COIN_GECKO_ENDPOINT = "https://api.coingecko.com/api/v3/simple/token_price";

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

export const getCoingeckoTokensPrices = async (tokens: { address: string; chainId: number }[]): Promise<TokenPriceResponse> => {
  try {
    // Separate tokens by chain
    const tokensByChain = tokens.reduce((acc, token) => {
      if (!acc[token.chainId]) acc[token.chainId] = [];
      acc[token.chainId].push(token.address);
      return acc;
    }, {} as { [chainId: number]: string[] });

    // Get prices for each chain
    const allRequests: Promise<AxiosResponse>[] = [];

    for (const chain in tokensByChain) {
      const networkCoingeckoId = appChains[chain].coingeckoId;
      const tokens = Array.from(new Set(tokensByChain[chain])).join(",");

      if (networkCoingeckoId) {
        const url = `${COIN_GECKO_ENDPOINT}/${networkCoingeckoId}?contract_addresses=${tokens}&vs_currencies=usd`;
        allRequests.push(axios.get(url));
      }
    }

    const data = await Promise.all(allRequests);
    return data.reduce((acc, response) => ({ ...acc, ...response.data }), {} as TokenPriceResponse);
  } catch (err) {
    console.error(err);
    throw new Error(`Error getting prices: ${err}`);
  }
};

export const getUniswapTokenPrices = async (tokens: { address: string; chainId: number }[]): Promise<TokenPriceResponse> => {
  try {
    // Separate tokens by chain
    const tokensByChain = tokens.reduce((acc, token) => {
      if (!acc[token.chainId]) acc[token.chainId] = [];
      acc[token.chainId].push(token.address);
      return acc;
    }, {} as { [chainId: number]: string[] });

    // Get prices for each chain
    const allRequests: Promise<AxiosResponse<IUniswapGetPricesResponse>>[] = [];

    for (const chain in tokensByChain) {
      const uniswapSubgraphUrl = appChains[chain].uniswapSubgraph;
      const tokens = Array.from(new Set(tokensByChain[chain]));

      if (uniswapSubgraphUrl) {
        const data = { query: GET_PRICES_UNISWAP, variables: { tokens } };
        allRequests.push(axios.post(uniswapSubgraphUrl, { ...data }));
      }
    }

    const responses = await Promise.all(allRequests);

    return responses.reduce((acc, { data: res }) => {
      const tokensData = res.data.tokens.reduce((acc2, token) => {
        acc2[token.address] = { usd: +token.priceInEth * +res.data.bundle.ethPriceUSD };
        return acc2;
      }, {} as TokenPriceResponse);

      return { ...acc, ...tokensData };
    }, {} as TokenPriceResponse);
  } catch (err) {
    console.error(err);
    throw new Error(`Error getting prices: ${err}`);
  }
};
