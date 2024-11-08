import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";
import { IGithubIssue } from "./types";

/**
 * Get all saved github issues for a vault
 */
export async function getGHSubmissions(vaultId: string | undefined): Promise<IGithubIssue[]> {
  if (!vaultId) return [];

  try {
    const response = await axiosClient.get(`${BASE_SERVICE_URL}/github-repos/issues/${vaultId}`);
    const githubIssues = response.data.githubIssues as IGithubIssue[];
    const githubIssuesWithSeverity = githubIssues.map((issue) => {
      const severity = issue.issueData.issueDescription.match(/(\*\*Severity:\*\* (.*)\n)/)?.[2];
      return {
        ...issue,
        severity,
      };
    });

    return githubIssuesWithSeverity;
  } catch (error) {
    return [];
  }
}

/**
 * Get the repo name created for a vault
 */
export async function getVaultRepoName(vaultId: string | undefined): Promise<string | undefined> {
  if (!vaultId) return undefined;

  try {
    const response = await axiosClient.get(`${BASE_SERVICE_URL}/github-repos/repo/${vaultId}`);
    const repoName = response.data.repoName as string | undefined;

    return repoName;
  } catch (error) {
    return undefined;
  }
}
