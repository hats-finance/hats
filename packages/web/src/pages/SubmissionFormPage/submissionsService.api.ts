import { IVault } from "@hats-finance/shared";
import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";
import { ISubmissionData, ISubmissionsDescriptionsData, ISubmitSubmissionRequest } from "./types";

/**
 * Submits a new vulnerability submission
 * @param submissionData - The submission data to be submitted
 * @param vault - The vault on which the submission will be submitted
 *
 * @returns True if the submission was successful, false otherwise
 */
export async function submitVulnerabilitySubmission(
  submissionData: ISubmissionData,
  vault: IVault
): Promise<{ success: boolean; auditCompetitionRepo?: string }> {
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
    createIssueRequests:
      vault.description?.["project-metadata"].type === "audit"
        ? // true
          submissionData.submissionsDescriptions.descriptions.map((vulnerability) => ({
            issueTitle: vulnerability.title,
            issueDescription: getIssueDescription(submissionData, vulnerability),
            issueFiles: vulnerability.files.map((file) => file.ipfsHash),
          }))
        : [],
  };

  try {
    const res = await axiosClient.post(`${BASE_SERVICE_URL}/submissions/submit-vulnerability`, submissionRequest);
    return { success: res.status === 200, auditCompetitionRepo: res.data.auditCompetitionRepo };
  } catch (error) {
    return { success: false };
  }
}

const getIssueDescription = (submissionData: ISubmissionData, vulnerability: ISubmissionsDescriptionsData["descriptions"][0]) => {
  return `
**Github username:** ${submissionData.contact?.githubUsername ? `@${submissionData.contact?.githubUsername}` : "--"}
**Beneficiary:** ${submissionData.contact?.beneficiary}
**Submission hash (on-chain):** ${submissionData.submissionResult?.transactionHash}
**Severity:** ${vulnerability.severity}

**Description:**
${vulnerability.description}
  
**Files:**
${vulnerability.files.map((file) => `  - ${file.name} (${BASE_SERVICE_URL}/files/${file.ipfsHash})`).join("\n")}
`;
};
