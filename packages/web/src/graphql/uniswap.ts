export const GET_PRICES_UNISWAP = `
  query getPrices($tokens: [String!]) {
    tokens(where: { id_in: $tokens }) {
      address: id
      priceInEth: derivedETH
    }
    bundle(id: "1") {
      ethPriceUSD
    }
  }
`;

export type IUniswapGetPricesResponse = {
  data: { tokens: { address: string; priceInEth: string }[]; bundle: { ethPriceUSD: string } };
};
