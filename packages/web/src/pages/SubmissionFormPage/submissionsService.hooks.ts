import { UseMutationResult, useMutation } from "@tanstack/react-query";
import * as SubmissionsService from "./submissionsService.api";
import { ISubmissionData } from "./types";

export const useSubmitVulnerability = (): UseMutationResult<boolean, unknown, { submissionData: ISubmissionData }, unknown> => {
  return useMutation({
    mutationFn: ({ submissionData }) => SubmissionsService.submitVulnerabilitySubmission(submissionData),
  });
};
