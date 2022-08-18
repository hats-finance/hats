import { gql } from "@apollo/client";

export const GET_PRICE = gql`
query Price($token: String!) @uniswapv3 {
    token(id: $token) {
        id
        name
        tokenDayData(skip:1,first:1) {
         priceUSD
        }
    }
}
`;

export const GET_PRICES = gql`
query Price($tokens: [String!]) @uniswapv3 {
    tokens( where: {id_in: $tokens}) {
        id
        name
        tokenDayData(skip:1,first:1) {
        priceUSD
        }
    }
}
`;

export type UniswapV3GetPrices = { tokens: { id, name, tokenDayData: { priceUSD: number[] } }[] };