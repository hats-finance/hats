import { rest } from "msw";
import { COIN_GECKO_ETHEREUM } from "../../src/constants/constants";

const coingecko = [
  rest.get(COIN_GECKO_ETHEREUM, async (req, res, ctx) => {
    const contract_addresses = req.url.searchParams.get("contract_addresses");
    const vs_currencies = req.url.searchParams.get("vs_currencies");
    console.log(
      `API call: GET - ${COIN_GECKO_ETHEREUM}`,
      "contract_addresses",
      contract_addresses || "n/a",
      "vs_currencies",
      vs_currencies || "n/a"
    );

    return res(ctx.json({}));
  })
];

const commonHandlers = [...coingecko];

export default commonHandlers;
