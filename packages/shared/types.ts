export interface INFTMetaData {
  name: string;
  description: string;
  animation_url: string;
  image: string;
  external_url: string;
}

export interface IBaseVulnerabilitySeverity {
  name: string;
  "contracts-covered": { [key: string]: string }[];
  "nft-metadata": INFTMetaData;
  description: string;
}

export interface IVulnerabilitySeverityV1 extends IBaseVulnerabilitySeverity {
  index: number;
}
export interface IVulnerabilitySeverityV2 extends IBaseVulnerabilitySeverity {
  percentage: number; // percentage like 1000 (10%) or 8000 (80%)
}

export type IVulnerabilitySeverity = IVulnerabilitySeverityV1 | IVulnerabilitySeverityV2;

export interface IEditedContractCovered {
  name: string;
  address: string;
  severities: string[]; // IVulnerabilitySeverity.name
}

export interface IEditedCommunicationEmail {
  address: string;
  status: "verified" | "unverified" | "verifying";
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

export interface ICommitteeMember {
  name: string;
  address: string;
  "twitter-link": string;
  "image-ipfs-link"?: string;
  "pgp-keys": Array<{ publicKey: string }>;
}

export interface IBaseEditedVaultDescription {
  version: "v1" | "v2";
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
    "multisig-address": string;
    members: Array<ICommitteeMember>;
  };
  "communication-channel": {
    "pgp-pk": string | string[];
  };
  "contracts-covered": IEditedContractCovered[];
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
