import { IVault } from "@hats-finance/shared";
import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";
import { ISubmissionData, ISubmitSubmissionRequest } from "./types";

/**
 * Submits a new vulnerability submission
 * @param submissionData - The submission data to be submitted
 * @param vault - The vault on which the submission will be submitted
 *
 * @returns True if the submission was successful, false otherwise
 */
export async function submitVulnerabilitySubmission(submissionData: ISubmissionData, vault: IVault): Promise<boolean> {
  if (!submissionData.project || !submissionData.submissionsDescriptions || !submissionData.submissionResult) {
    throw new Error(`Invalid params on 'submitVulnerabilitySubmission' function: ${submissionData}`);
  }

  const submissionRequest: ISubmitSubmissionRequest = {
    submitVulnerabilityRequest: {
      chainId: submissionData.submissionResult.chainId,
      txHash: submissionData.submissionResult.transactionHash,
      msg: submissionData.submissionsDescriptions.submission,
      route: submissionData.project.projectName,
      projectId: submissionData.project.projectId,
    },
    createIssueRequest:
      vault.description?.["project-metadata"].type === "audit"
        ? submissionData.submissionsDescriptions.descriptions.map((vulnerability) => ({
            issueTitle: vulnerability.title,
            issueDescription: vulnerability.description,
            issueFiles: vulnerability.files.map((file) => file.ipfsHash),
          }))
        : [],
  };

  try {
    const res = await axiosClient.post(`${BASE_SERVICE_URL}/submissions/submit-vulnerability`, submissionRequest);
    return res.status === 200;
  } catch (error) {
    return false;
  }
}
