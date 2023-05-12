import { ISavedFile } from "components";
import { SessionKey } from "openpgp";

export enum SubmissionStep {
  project,
  contact,
  submissionsDescriptions,
  terms,
  submission,
}

export interface ISubmissionProjectData {
  verified: boolean;
  projectName: string;
  projectId: string;
}

export interface ISubmissionContactData {
  beneficiary: string;
  communicationChannel: string;
  communicationChannelType: "discord" | "email" | "telegram";
  githubUsername?: string;
  verified: boolean;
}

export interface ISubmissionsDescriptionsData {
  verified: boolean;
  submission: string; // Submission object ({encrypted: string, decrypted: string})
  submissionMessage: string;
  descriptions: {
    title: string;
    description: string;
    severity: string;
    files: ISavedFile[];
    sessionKey: SessionKey;
  }[];
}

export interface ISubmissionTermsData {
  verified: boolean;
}

export interface ISubmissionResultData {
  verified: boolean;
  txStatus: SubmissionOpStatus | undefined;
  botStatus: SubmissionOpStatus | undefined;
  transactionHash: string;
  chainId: number;
}

export interface ISubmissionData {
  version: string;
  project?: ISubmissionProjectData;
  contact?: ISubmissionContactData;
  submissionsDescriptions: ISubmissionsDescriptionsData;
  terms?: ISubmissionTermsData;
  submissionResult?: ISubmissionResultData;
}

export enum SubmissionOpStatus {
  Pending,
  Success,
  Fail,
}

export interface ISubmitSubmissionRequest {
  submitVulnerabilityRequest: {
    chainId: number;
    msg: string;
    txHash: string;
    route: string;
    projectId: string;
  };
  createIssueRequests: {
    issueTitle: string;
    issueDescription: string;
    issueFiles: string[];
  }[];
}
