import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/vaults/useVaults";
import { useAccount } from "wagmi";
import * as SubmissionsService from "./submissionsService.api";

type IVaultSubmission = {
  cid: string;
};

export const useVaultSubmissionsBySiweUser = (): UseQueryResult<IVaultSubmission[]> => {
  const { isAuthenticated, profileData } = useSiweAuth();
  const { address } = useAccount();
  const { allSubmissions, allVaults, vaultsReadyAllChains, submissionsReadyAllChains } = useVaults();

  const queryResult = useQuery({
    queryKey: ["vault-submissions-by-siwe-user", profileData.address],
    queryFn: () => SubmissionsService.getVaultSubmissionsBySiweUser(address, allSubmissions, allVaults),
    enabled: isAuthenticated && !!profileData.address && !!address && vaultsReadyAllChains && submissionsReadyAllChains,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    isLoading: queryResult.isLoading,
  } as UseQueryResult<IVaultSubmission[]>;
};
