import { ICommitteeMember, IVulnerabilitySeverityV1, IVulnerabilitySeverityV2 } from "types/types";
export interface IEditedContractCovered {
  name: string;
  address: string;
  severities: string[]; // IVulnerabilitySeverity.name
}

export type IEditedVulnerabilitySeverityV1 = IVulnerabilitySeverityV1 & { id?: string };
export type IEditedVulnerabilitySeverityV2 = IVulnerabilitySeverityV2 & { id?: string };
export interface IVulnerabilitySeveritiesTemplateV1 {
  severities: IEditedVulnerabilitySeverityV1[];
  name: string;
  indexArray: number[];
}
export interface IVulnerabilitySeveritiesTemplateV2 {
  severities: IEditedVulnerabilitySeverityV2[];
  name: string;
}

export interface IBaseEditedVaultDescription {
  version: string;
  "project-metadata": {
    icon: string;
    website: string;
    name: string;
    tokenIcon: string;
    type?: string;
    endtime?: number;
    starttime?: number;
  };
  "communication-channel": {
    "pgp-pk": string | string[];
  };
  committee: {
    "multisig-address": string;
    members: Array<ICommitteeMember>;
  };
  "contracts-covered": IEditedContractCovered[];
  source: {
    name: string;
    url: string;
  };
  "additional-vaults"?: string[];
}

interface IEditedVaultDescriptionV1 extends IBaseEditedVaultDescription {
  version: "v1";
  "vulnerability-severities-spec": IVulnerabilitySeveritiesTemplateV1;
}
interface IEditedVaultDescriptionV2 extends IBaseEditedVaultDescription {
  version: "v2";
  "vulnerability-severities-spec": IVulnerabilitySeveritiesTemplateV2;
}

export type IEditedVaultDescription = IEditedVaultDescriptionV1 | IEditedVaultDescriptionV2;



