import axios from "axios";
import { ChainsConfig } from "../config";

export const GET_REGISTRIES = `
  query getRegistries {
    masters {
      address
      withdrawPeriod
      safetyPeriod
    }
  }
`;

type IRegistryInfo = {
  address: string;
  chainId: number;
  safetyPeriod: number;
  withdrawPeriod: number;
  nextSafetyPeriod: number;
  isSafetyPeriod: boolean;
};

export const getAllRegistriesInfo = async (): Promise<IRegistryInfo[]> => {
  const subgraphsRequests = Object.values(ChainsConfig).map((chain) => {
    return axios.post(
      chain.subgraph,
      JSON.stringify({
        query: GET_REGISTRIES,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  });

  const subgraphsResponses = await Promise.all(subgraphsRequests);
  const subgraphsData = subgraphsResponses.map((res) => res.data);

  const registries: IRegistryInfo[] = [];
  for (let i = 0; i < subgraphsData.length; i++) {
    const chainId = Object.values(ChainsConfig)[i].chain.id;

    for (const registry of subgraphsData[i].data.masters) {
      const withdrawPeriod = +registry.withdrawPeriod;
      const safetyPeriod = +registry.safetyPeriod;
      const secondsInPeriod = (Date.now() / 1000) % (withdrawPeriod + safetyPeriod);

      let nextSafetyPeriod: number;
      let isSafetyPeriod = false;
      if (secondsInPeriod >= withdrawPeriod) {
        nextSafetyPeriod = safetyPeriod + withdrawPeriod * 2 - secondsInPeriod;
        isSafetyPeriod = true;
      } else {
        nextSafetyPeriod = withdrawPeriod - secondsInPeriod;
      }

      registries.push({
        address: registry.address,
        safetyPeriod,
        withdrawPeriod,
        nextSafetyPeriod,
        isSafetyPeriod,
        chainId,
      });
    }
  }

  return registries;
};
