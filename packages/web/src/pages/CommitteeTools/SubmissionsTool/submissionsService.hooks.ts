import { ISubmittedSubmission } from "@hats-finance/shared";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useKeystore } from "components/Keystore";
import { useSubmissions } from "hooks/subgraph/submissions/useSubmissions";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useAccount } from "wagmi";
import * as SubmissionsService from "./submissionsService.api";

export const useVaultSubmissionsByKeystore = (): UseQueryResult<ISubmittedSubmission[]> => {
  const { address } = useAccount();
  const { allVaults, vaultsReadyAllChains } = useVaults();
  const { allSubmissions, submissionsReadyAllChains } = useSubmissions();
  const { keystore } = useKeystore();

  const queryResult = useQuery({
    queryKey: ["vault-submissions-by-siwe-user", address],
    queryFn: () => SubmissionsService.getVaultSubmissionsByKeystore(address, allSubmissions, allVaults, keystore?.storedKeys),
    enabled: !!address && !!keystore && vaultsReadyAllChains && submissionsReadyAllChains,
    refetchOnWindowFocus: false,
    retry: false,
    refetchOnMount: false,
  });

  return {
    ...queryResult,
  } as UseQueryResult<ISubmittedSubmission[]>;
};
