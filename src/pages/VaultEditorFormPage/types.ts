import { ICommitteeMember, IVulnerabilitySeverityV1, IVulnerabilitySeverityV2 } from "types/types";

export interface IEditedContractCovered {
  name: string;
  address: string;
  severities: string[]; // IVulnerabilitySeverity.name
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
  "project-metadata": {
    icon: string;
    website: string;
    name: string;
    tokenIcon: string;
    type?: string;
    endtime?: number;
    starttime?: number;
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
