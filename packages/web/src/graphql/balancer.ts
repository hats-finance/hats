export const GET_PRICES_BALANCER = `
  query getPrices {
    tokenGetCurrentPrices {
      price
      address
    }
  }
`;

export type IBalancerGetPricesResponse = {
  data: { tokenGetCurrentPrices: { address: string; price: string }[] };
};
