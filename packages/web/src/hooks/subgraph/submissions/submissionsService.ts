import { ISubmittedSubmission } from "@hats.finance/shared";
import { GET_SUBMISSIONS } from "graphql/subgraph";
import { appChains } from "settings";
import { fetchWithTimeout } from "utils/fetchWithTimeout.utils";

export type IGraphSubmissionsData = {
  test: ISubmissionsSubgraphData;
  prod: ISubmissionsSubgraphData;
};

export type ISubmissionsSubgraphData = {
  submissions: ISubmittedSubmission[];
};

type ISubmissionsSubgraphResponse = {
  data: ISubmissionsSubgraphData;
  chainId: number;
};

const BATCH_SIZE = 1000;

/**
 * Gets subgraph data for submissions
 * @param chainId - The chain id to get the subgraph data from
 * @param savedSubmissionsCount - The number of submissions already saved in local storage
 *
 * @returns The submissions info from the subgraph
 */
export async function getSubmissionSubgraphData(
  chainId: number,
  savedSubmissionsCount: number
): Promise<ISubmissionsSubgraphResponse> {
  try {
    if (!chainId) throw new Error("Chain id not provided");
    const subgraphUrl = appChains[chainId].subgraph;
    const submissions = [] as ISubmittedSubmission[];

    const initialSkip = savedSubmissionsCount;
    let fetchsCount = 0;
    while (true) {
      try {
        const resTest = await fetchWithTimeout(subgraphUrl, {
          method: "POST",
          body: JSON.stringify({
            query: GET_SUBMISSIONS,
            variables: { batch: BATCH_SIZE, skip: initialSkip + fetchsCount * BATCH_SIZE },
          }),
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });
        const dataJsonTest = await resTest.json();

        if (!dataJsonTest.data) throw new Error();

        fetchsCount += 1;
        submissions.push(...dataJsonTest.data.submissions);
        if (dataJsonTest.data.submissions.length !== BATCH_SIZE) break;
      } catch (error) {
        console.log(error);
        throw new Error(`Error fetching subgraph data on chain ${chainId}`);
      }
    }

    return { data: { submissions }, chainId };
  } catch (error) {
    throw new Error(`Unknown error: ${error}`);
  }
}
