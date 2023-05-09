import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";
import { ISubmissionData, ISubmitSubmissionRequest } from "./types";

/**
 * Submits a new vulnerability submission
 * @param submissionData - The submission data to be submitted
 *
 * @returns True if the submission was successful, false otherwise
 */
export async function submitVulnerabilitySubmission(submissionData: ISubmissionData): Promise<boolean> {
  if (!submissionData.project || !submissionData.description || !submissionData.submissionResult) {
    throw new Error(`Invalid params on 'submitVulnerabilitySubmission' function: ${submissionData}`);
  }

  const submissionRequest: ISubmitSubmissionRequest = {
    submitVulnerabilityRequest: {
      chainId: submissionData.submissionResult.chainId,
      txHash: submissionData.submissionResult.transactionHash,
      msg: submissionData.description.encryptedData,
      route: submissionData.project.projectName,
      projectId: submissionData.project.projectId,
    },
    createIssueRequest: {
      issueTitle: "asd",
      issueDescription: "asd",
      issueFiles: [],
    },
  };

  try {
    const res = await axiosClient.post(`${BASE_SERVICE_URL}/submissions/submit-vulnerability`, submissionRequest);
    return res.status === 200;
  } catch (error) {
    return false;
  }
}
