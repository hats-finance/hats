import { ISubmittedSubmission } from "@hats-finance/shared";
import axios from "axios";
import { LocalStorage } from "constants/constants";
import { blacklistedWallets } from "data/blacklistedWallets";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { IS_PROD, appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { isValidIpfsHash } from "utils/ipfs.utils";
import { useAccount, useNetwork } from "wagmi";
import { useMultiChainSubmissions } from "./useMultiChainSubmissions";

interface ISubmissionsContext {
  submissionsReadyAllChains: boolean;
  allSubmissions?: ISubmittedSubmission[]; // Submissions without chains filtering
  allSubmissionsOnEnv?: ISubmittedSubmission[]; // Submissions filtered by chains
}

export const SubmissionsContext = createContext<ISubmissionsContext>(undefined as any);

export function useSubmissions(): ISubmissionsContext {
  return useContext(SubmissionsContext);
}

export function SubmissionsProvider({ children }: PropsWithChildren<{}>) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();

  const [submissionsReadyAllChains, setSubmissionsReadyAllChains] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<ISubmittedSubmission[]>([]);
  const [allSubmissionsOnEnv, setAllSubmissionsOnEnv] = useState<ISubmittedSubmission[]>([]);

  const connectedChain = chain ? appChains[chain.id] : null;
  // If we're in production, show mainnet. If not, show the connected network (if any, otherwise show testnets)
  const showTestnets = !IS_PROD && connectedChain?.chain.testnet;

  if (account && blacklistedWallets.indexOf(account) !== -1) {
    throw new Error("Blacklisted wallet");
  }

  // const savedSubmissions = JSON.parse(localStorage.getItem(`${LocalStorage.Submissions}`) ?? "[]") as ISubmittedSubmission[];
  const { multiChainData, allChainsLoaded } = useMultiChainSubmissions();

  const setSubmissionsWithDetails = async (submissionsData: ISubmittedSubmission[]) => {
    const loadSubmissionData = async (submission: ISubmittedSubmission): Promise<string | undefined> => {
      if (isValidIpfsHash(submission.submissionHash)) {
        try {
          const dataResponse = await axios.get(ipfsTransformUri(submission.submissionHash));
          const object = dataResponse.data;
          return object;
        } catch (error) {
          // console.error(error);
          return undefined;
        }
      }
      return undefined;
    };

    const getSubmissionData = async (submissionsToFetch: ISubmittedSubmission[]): Promise<ISubmittedSubmission[]> =>
      Promise.all(
        submissionsToFetch.map(async (submission) => {
          const existsSubmissionData = allSubmissions.find((v) => v.id === submission.id)?.submissionData;
          const submissionData = existsSubmissionData ?? (await loadSubmissionData(submission));

          return { ...submission, submissionData } as ISubmittedSubmission;
        })
      );

    const savedSubmissions = JSON.parse(localStorage.getItem(`${LocalStorage.Submissions}`) ?? "[]") as ISubmittedSubmission[];
    const allSubmissionsData = [...(await getSubmissionData(submissionsData)), ...savedSubmissions];
    localStorage.setItem(`${LocalStorage.Submissions}`, JSON.stringify(allSubmissionsData));

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
  };

  return <SubmissionsContext.Provider value={context}>{children}</SubmissionsContext.Provider>;
}
