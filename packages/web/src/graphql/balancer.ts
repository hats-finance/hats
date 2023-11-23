export const GET_PRICES_BALANCER = `
  query getPrices {
    tokenGetCurrentPrices(chains:[MAINNET, ARBITRUM, OPTIMISM, POLYGON]) {
      price
      address
    }
  }
`;

export type IBalancerGetPricesResponse = {
  data: { tokenGetCurrentPrices: { address: string; price: string }[] };
};
