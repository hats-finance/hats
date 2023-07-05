import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useKeystore } from "components/Keystore";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/vaults/useVaults";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import * as SubmissionsService from "./submissionsService.api";

type IVaultSubmission = {
  cid: string;
};

export const useVaultSubmissionsBySiweUser = (): UseQueryResult<IVaultSubmission[]> => {
  const { isAuthenticated, profileData } = useSiweAuth();
  const { address } = useAccount();
  const { allSubmissions, allVaults, vaultsReadyAllChains, submissionsReadyAllChains } = useVaults();
  const { keystore, initKeystore } = useKeystore();

  useEffect(() => {
    if (!keystore) initKeystore();
  }, [keystore, initKeystore]);

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
    isLoading: queryResult.isLoading,
  } as UseQueryResult<IVaultSubmission[]>;
};
