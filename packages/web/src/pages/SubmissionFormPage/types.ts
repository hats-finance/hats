import { SessionKey } from "openpgp";

export enum SubmissionStep {
  project,
  contact,
  description,
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

export interface ISubmissionDescriptionData {
  verified: boolean;
  title: string;
  description: string;
  encryptedData: string;
  sessionKey: SessionKey;
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
  description?: ISubmissionDescriptionData;
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
  createIssueRequest: {
    issueTitle: string;
    issueDescription: string;
    issueFiles: any[];
  };
}
