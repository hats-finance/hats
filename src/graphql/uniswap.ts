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
