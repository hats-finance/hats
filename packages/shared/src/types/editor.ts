import { ICommitteeMember, IVulnerabilitySeverityV1, IVulnerabilitySeverityV2 } from "./types";

export interface IEditedContractCovered {
  name: string;
  address: string;
  severities: string[]; // IVulnerabilitySeverity.name
}

export interface IEditedCommunicationEmail {
  address: string;
  status: "verified" | "unverified" | "verifying";
}

export interface IEditedVaultAsset {
  address: string;
  symbol: string;
}

export interface IEditedVaultParameters {
  fixedCommitteeControlledPercetange: number;
  fixedHatsGovPercetange: number;
  fixedHatsRewardPercetange: number;
  // Editable
  maxBountyPercentage: number;
  immediatePercentage: number;
  vestedPercentage: number;
  committeePercentage: number;
}

export type IEditedVulnerabilitySeverityV1 = IVulnerabilitySeverityV1 & { id?: string };
export type IEditedVulnerabilitySeverityV2 = IVulnerabilitySeverityV2 & { id?: string };

export type IEditedVulnerabilitySeverity = IEditedVulnerabilitySeverityV1 | IEditedVulnerabilitySeverityV2;

export interface IBaseVulnerabilitySeveritiesTemplate {
  name: string;
  severities: IEditedVulnerabilitySeverity[];
}

export interface IVulnerabilitySeveritiesTemplateV1 extends IBaseVulnerabilitySeveritiesTemplate {
  severities: IEditedVulnerabilitySeverityV1[];
  indexArray?: number[];
}
export interface IVulnerabilitySeveritiesTemplateV2 extends IBaseVulnerabilitySeveritiesTemplate {
  severities: IEditedVulnerabilitySeverityV2[];
}

export type IVulnerabilitySeveritiesTemplate = IVulnerabilitySeveritiesTemplateV1 | IVulnerabilitySeveritiesTemplateV2;

export interface IBaseEditedVaultDescription {
  version: "v1" | "v2";
  vaultCreatedInfo?: {
    vaultAddress: string;
    chainId: number;
  };
  "project-metadata": {
    icon: string;
    website: string;
    name: string;
    tokenIcon: string;
    type?: string;
    endtime?: number;
    starttime?: number;
    emails: IEditedCommunicationEmail[];
  };
  committee: {
    chainId?: string;
    "multisig-address": string;
    members: Array<ICommitteeMember>;
  };
  "communication-channel": {
    "pgp-pk": string | string[];
  };
  "contracts-covered": IEditedContractCovered[];
  assets: IEditedVaultAsset[];
  parameters: IEditedVaultParameters;
  source: {
    name: string;
    url: string;
  };
  "additional-vaults"?: string[];
  severitiesOptions?: { label: string; value: string }[];
  includesStartAndEndTime: boolean;
}

export interface IEditedVaultDescriptionV1 extends IBaseEditedVaultDescription {
  version: "v1";
  "vulnerability-severities-spec": IVulnerabilitySeveritiesTemplateV1;
}
export interface IEditedVaultDescriptionV2 extends IBaseEditedVaultDescription {
  version: "v2";
  "vulnerability-severities-spec": IVulnerabilitySeveritiesTemplateV2;
}

export type IEditedVaultDescription = IEditedVaultDescriptionV1 | IEditedVaultDescriptionV2;

export interface IEditedSessionResponse {
  editedDescription: IEditedVaultDescription;
  descriptionHash: string;
  chainId?: number;
  vaultAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
  editingExistingVault?: boolean;
}

export interface ICreateVaultOnChainCall {
  chainId: number;
  name: string;
  symbol: string;
  rewardController: string;
  vestingDuration: number;
  vestingPeriods: number;
  maxBounty: number;
  bountySplit: {
    hacker: number;
    hackerVested: number;
    committee: number;
  };
  asset: string;
  owner: string;
  committee: string;
  isPaused: boolean;
  descriptionHash: string;
}
