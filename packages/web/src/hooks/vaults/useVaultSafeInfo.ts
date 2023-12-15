import { getGnosisSafeInfo, IGnosisSafeInfoResponse, IVault } from "@hats.finance/shared";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useVaultSafeInfo = (vault: IVault | undefined): UseQueryResult<IGnosisSafeInfoResponse> => {
  return useQuery({
    queryKey: ["safe-info", vault?.committee, vault?.chainId],
    queryFn: () => getGnosisSafeInfo(vault?.committee, vault?.chainId),
    enabled: !!vault && !!vault.committee && !!vault.chainId,
    refetchOnWindowFocus: true,
  });
};
