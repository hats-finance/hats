import { useState } from "react";
import { AnalysisResponse, ExcludePatterns } from "../types";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useIsGrowthMember } from "hooks/useIsGrowthMember";
import { useIsGovMember } from "hooks/useIsGovMember";
import { BASE_SERVICE_URL } from "settings";

export const useRepoAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentSiweData } = useSiweAuth();
  const isGrowthMember = useIsGrowthMember();
  const isGovMember = useIsGovMember();

  const analyzeRepo = async (repoOwner: string, repoName: string, excludePatterns?: ExcludePatterns) => {
    if (!isGrowthMember && !isGovMember) {
      setError("Unauthorized: Only growth team and governance members can access this feature");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${BASE_SERVICE_URL}/github-repos/analyze/${repoOwner}/${repoName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(currentSiweData && {
              "X-SIWE-Message": currentSiweData.message,
              "X-SIWE-Signature": currentSiweData.signature,
            }),
          },
          body: excludePatterns ? JSON.stringify({ excludePatterns }) : undefined,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while analyzing the repository");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeRepo,
    isLoading,
    data,
    error,
  };
}; 