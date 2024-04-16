import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils.js";
import { AirdropElegibility } from "../types";
import { getAirdropMerkleTreeJSON } from "./getAirdropMerkelTreeJSON";

export const getAirdropElegibility = async (address: string, env: "test" | "prod"): Promise<AirdropElegibility | false> => {
  try {
    const merkelTreeJson = await getAirdropMerkleTreeJSON(env);
    const addressInfo = merkelTreeJson[getAddress(address)];
    if (!addressInfo) return false;

    const total = Object.keys(addressInfo.token_eligibility)
      .reduce((acc, key) => acc.add(BigNumber.from(addressInfo.token_eligibility[key] ?? 0)), BigNumber.from(0))
      .toString();

    return {
      ...addressInfo.token_eligibility,
      total,
    };
  } catch (error) {
    console.log("Error on getAirdropElegibility: ", error);
    return false;
  }
};
