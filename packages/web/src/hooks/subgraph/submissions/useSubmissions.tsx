import { ISubmissionMessageObject, ISubmittedSubmission } from "@hats.finance/shared";
import axios from "axios";
import { LocalStorage } from "constants/constants";
import { OFAC_Sanctioned_Digital_Currency_Addresses } from "data/OFACSanctionedAddresses";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { IS_PROD, appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { isValidIpfsHash } from "utils/ipfs.utils";
import { useAccount, useNetwork } from "wagmi";
import { useMultiChainSubmissions } from "./useMultiChainSubmissions";

const MAX_CALLS_AT_ONCE = 500;

interface ISubmissionsContext {
  submissionsReadyAllChains: boolean;
  allSubmissions?: ISubmittedSubmission[]; // Submissions without chains filtering
  allSubmissionsOnEnv?: ISubmittedSubmission[]; // Submissions filtered by chains
  canLoadSubmissions: boolean;
  setCanLoadSubmissions: (bool: boolean) => void;
}

export const SubmissionsContext = createContext<ISubmissionsContext>(undefined as any);

export function useSubmissions(): ISubmissionsContext {
  // Delete Old Submissions from Local Storage
  localStorage.removeItem(LocalStorage.Submissions);

  const ctx = useContext(SubmissionsContext);
  ctx.setCanLoadSubmissions(true);

  return ctx;
}

export function SubmissionsProvider({ children }: PropsWithChildren<{}>) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const [canLoadSubmissions, setCanLoadSubmissions] = useState(false);
  const [submissionsReadyAllChains, setSubmissionsReadyAllChains] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<ISubmittedSubmission[]>([]);
  const [allSubmissionsOnEnv, setAllSubmissionsOnEnv] = useState<ISubmittedSubmission[]>([]);

  const connectedChain = chain ? appChains[chain.id] : null;
  // If we're in production, show mainnet. If not, show the connected network (if any, otherwise show testnets)
  const showTestnets = !IS_PROD && connectedChain?.chain.testnet;

  if (account && OFAC_Sanctioned_Digital_Currency_Addresses.indexOf(account) !== -1) {
    throw new Error("This wallet address is on the OFAC Sanctioned Digital Currency Addresses list and cannot be used.");
  }

  const { multiChainData, allChainsLoaded } = useMultiChainSubmissions(canLoadSubmissions);

  const setSubmissionsWithDetails = async (submissionsData: ISubmittedSubmission[]) => {
    const loadSubmissionData = async (submission: ISubmittedSubmission): Promise<ISubmissionMessageObject | undefined> => {
      if (isValidIpfsHash(submission.submissionHash)) {
        try {
          const dataResponse = await axios.get(ipfsTransformUri(submission.submissionHash), { timeout: 10000 });
          const object = dataResponse.data;
          return object;
        } catch (error) {
          // console.error(error);
          return undefined;
        }
      }
      return undefined;
    };

    const getSubmissionData = async (submissionsToFetch: ISubmittedSubmission[]): Promise<ISubmittedSubmission[]> => {
      const submissions = [] as ISubmittedSubmission[];

      for (let i = 0; i < submissionsToFetch.length; i += MAX_CALLS_AT_ONCE) {
        const submissionsChunk = submissionsToFetch.slice(i, i + MAX_CALLS_AT_ONCE);
        const submissionsData = await Promise.all(
          submissionsChunk.map(async (submission) => {
            const existsSubmissionData = allSubmissions.find((v) => v.id === submission.id)?.submissionData;
            const submissionData = existsSubmissionData ?? (await loadSubmissionData(submission));

            return { ...submission, submissionData } as ISubmittedSubmission;
          })
        );
        submissions.push(...submissionsData);
      }

      return submissions;
    };

    const allSubmissionsData = await getSubmissionData(submissionsData);
    const filteredByValidContent = allSubmissionsData.filter((submission) => submission.submissionData);

    const filteredByChain = filteredByValidContent.filter((vault) => {
      return showTestnets ? appChains[vault.chainId as number].chain.testnet : !appChains[vault.chainId as number].chain.testnet;
    });

    if (JSON.stringify(allSubmissions) !== JSON.stringify(filteredByValidContent)) setAllSubmissions(filteredByValidContent);
    if (JSON.stringify(allSubmissionsOnEnv) !== JSON.stringify(filteredByChain)) setAllSubmissionsOnEnv(filteredByChain);
    if (allChainsLoaded) setSubmissionsReadyAllChains(true);
  };

  useEffect(() => {
    setSubmissionsWithDetails([...multiChainData.prod.submissions, ...multiChainData.test.submissions]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiChainData, showTestnets, allChainsLoaded]);

  const context: ISubmissionsContext = {
    submissionsReadyAllChains,
    allSubmissions,
    allSubmissionsOnEnv,
    canLoadSubmissions,
    setCanLoadSubmissions,
  };

  return <SubmissionsContext.Provider value={context}>{children}</SubmissionsContext.Provider>;
}
