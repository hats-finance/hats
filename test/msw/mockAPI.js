import { rest } from "./server";

const coingecko = [
  rest.get(
    "https://api.coingecko.com/api/v3/simple/token_price/ethereum",
    async (req, res, ctx) => {
      const contract_addresses = req.url.searchParams.get("contract_addresses");
      const vs_currencies = req.url.searchParams.get("vs_currencies");
      console.log(
        "API call: GET - https://api.coingecko.com/api/v3/simple/token_price/ethereum",
        contract_addresses,
        vs_currencies
      );

      return res(ctx.json({}));
    }
  ),
];

const commonHandlers = [...coingecko];

export default commonHandlers;
