import { ISubmittedSubmission } from "@hats.finance/shared";
import { useQueries } from "@tanstack/react-query";
import { LocalStorage } from "constants/constants";
import { useEffect, useState } from "react";
import { appChains } from "settings";
import { parseSubmissions } from "./parser";
import { IGraphSubmissionsData, getSubmissionSubgraphData } from "./submissionsService";

const INITIAL_NETWORK_DATA = {
  submissions: [] as ISubmittedSubmission[],
};
const INITIAL_SUBMISSIONS_DATA: IGraphSubmissionsData = {
  test: { ...INITIAL_NETWORK_DATA },
  prod: { ...INITIAL_NETWORK_DATA },
};

export const useMultiChainSubmissions = () => {
  const [multiChainData, setMultiChainData] = useState<IGraphSubmissionsData>(INITIAL_SUBMISSIONS_DATA);
  const [allChainsLoaded, setAllChainsLoaded] = useState(false);

  const subgraphQueries = useQueries({
    queries: Object.keys(appChains).map((chainId) => ({
      queryKey: ["subgraph-submissions", chainId],
      queryFn: () => {
        const savedSubmissions = JSON.parse(
          localStorage.getItem(`${LocalStorage.Submissions}`) ?? "[]"
        ) as ISubmittedSubmission[];
        const savedSubmissionsCount = savedSubmissions.filter((submission) => submission?.chainId === +chainId).length;
        return getSubmissionSubgraphData(+chainId, savedSubmissionsCount);
      },
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    })),
  });

  useEffect(() => {
    if (subgraphQueries.some((a) => a.isLoading)) return;

    const submissionsData = subgraphQueries.reduce(
      (acc, query) => {
        if (!query.data) return acc;

        const { chainId, data } = query.data;

        // Add chainId to all the objects inside query data
        data.submissions = parseSubmissions(data.submissions, chainId);

        if (appChains[chainId].chain.testnet) {
          acc.test.submissions = [...acc.test.submissions, ...data.submissions];
        } else {
          acc.prod.submissions = [...acc.prod.submissions, ...data.submissions];
        }

        return acc;
      },
      { test: { ...INITIAL_NETWORK_DATA }, prod: { ...INITIAL_NETWORK_DATA } }
    );

    setAllChainsLoaded(subgraphQueries.every((a) => a.isFetched || a.isError));
    if (JSON.stringify(submissionsData) !== JSON.stringify(multiChainData)) {
      setMultiChainData(submissionsData);
    }
  }, [subgraphQueries, multiChainData]);

  return { multiChainData, allChainsLoaded };
};
