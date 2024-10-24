import { GithubIssue } from "@hats.finance/shared";
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
  twitterUsername?: string;
  verified: boolean;
}

export interface ISubmissionsDescriptionsData {
  verified: boolean;
  submission: string; // Submission object ({encrypted: string, decrypted: string})
  submissionMessage: string; // It's only for showing on the frontend final step
  descriptions: {
    type: "new" | "complement"; // "new" is for new vulnerabilities, "complement" is for fix/test submissions

    // complement fields
    testNotApplicable: boolean;
    complementTestFiles: { file: ISavedFile; path: string }[];
    complementFixFiles: { file: ISavedFile; path: string }[];
    complementGhIssueNumber?: string;
    complementGhIssue?: GithubIssue;

    // new fields
    title: string;
    description: string;
    severity: string;
    files: ISavedFile[];
    sessionKey?: SessionKey;
    isEncrypted?: boolean;
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
  auditCompetitionRepo?: string;
  chainId: number;
}

export interface ISubmissionData {
  version?: string;
  project?: ISubmissionProjectData;
  contact?: ISubmissionContactData;
  submissionsDescriptions: ISubmissionsDescriptionsData;
  terms?: ISubmissionTermsData;
  submissionResult?: ISubmissionResultData;
  ref?: "audit-wizard";
  auditWizardData?: IAuditWizardSubmissionData;
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
  createPRsRequests: {
    pullRequestTitle: string;
    pullRequestDescription: string;
    pullRequestFiles: { path: string; fileIpfsHash: string }[];
    githubIssue: GithubIssue;
    githubIssueNumber?: number;
  }[];
}

export interface IAuditWizardSubmissionData {
  signature: string;
  contact: {
    beneficiary: string;
    communicationChannel: string;
    communicationChannelType: ISubmissionContactData["communicationChannelType"];
  };
  project: { projectId: string };
  submissionsDescriptions: { descriptions: { title: string; severity: string; description: string }[] };
}

/**
 * This functions puts the current state of the form into the AuditWizard format in order to
 * verify it with their API. The from should have exactly the same values as the received from
 * audit wizard.
 */
export const getCurrentAuditwizardSubmission = (
  awSubmission: IAuditWizardSubmissionData,
  form: ISubmissionData
): IAuditWizardSubmissionData => {
  return {
    ...awSubmission,
    contact: {
      ...awSubmission.contact,
      beneficiary: form.contact?.beneficiary ?? "",
      communicationChannel: form.contact?.communicationChannel ?? "",
      communicationChannelType: form.contact?.communicationChannelType ?? "email",
    },
    project: {
      ...awSubmission.project,
      projectId: form.project?.projectId ?? "",
    },
    submissionsDescriptions: {
      ...awSubmission.submissionsDescriptions,
      descriptions:
        form.submissionsDescriptions?.descriptions.map((d, idx) => ({
          title: d.title ?? "",
          description: d.description ?? "",
          severity: awSubmission.submissionsDescriptions.descriptions[idx].severity,
        })) ?? [],
    },
  };
};
