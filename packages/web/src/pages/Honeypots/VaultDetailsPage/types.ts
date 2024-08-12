import { ISubmitSubmissionRequest } from "pages/Submissions/SubmissionFormPage/types";

export interface IGithubIssue {
  _id: string;
  createdAt: Date;
  vaultId: string;
  repoName: string;
  issueData: ISubmitSubmissionRequest["createIssueRequests"][0];
  severity?: string;
}

export type MessageSignature = {
  address: string;
  signature: string;
};
