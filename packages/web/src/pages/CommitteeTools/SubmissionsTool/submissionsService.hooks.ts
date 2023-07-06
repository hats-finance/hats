import { ISubmittedSubmission } from "@hats-finance/shared";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useKeystore } from "components/Keystore";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/vaults/useVaults";
import { useAccount } from "wagmi";
import * as SubmissionsService from "./submissionsService.api";

export const useVaultSubmissionsBySiweUser = (): UseQueryResult<ISubmittedSubmission[]> => {
  const { isAuthenticated, profileData } = useSiweAuth();
  const { address } = useAccount();
  const { allSubmissions, allVaults, vaultsReadyAllChains, submissionsReadyAllChains } = useVaults();
  const { keystore } = useKeystore();

  // console.log("isAuthenticated", isAuthenticated);
  // console.log("keystore", keystore);
  // console.log("vaultsReadyAllChains", vaultsReadyAllChains);
  // console.log("submissionsReadyAllChains", submissionsReadyAllChains);

  const queryResult = useQuery({
    queryKey: ["vault-submissions-by-siwe-user", profileData.address],
    queryFn: () => SubmissionsService.getVaultSubmissionsBySiweUser(address, allSubmissions, allVaults, keystore?.storedKeys),
    enabled:
      isAuthenticated && !!profileData.address && !!address && !!keystore && vaultsReadyAllChains && submissionsReadyAllChains,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    ...queryResult,
  } as UseQueryResult<ISubmittedSubmission[]>;
};
