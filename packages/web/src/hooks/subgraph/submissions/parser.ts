import { ISubmittedSubmission } from "@hats-finance/shared";

export const parseSubmissions = (submissions: ISubmittedSubmission[], chainId: number) => {
  return submissions.map((submission) => ({
    ...submission,
    chainId,
  }));
};
