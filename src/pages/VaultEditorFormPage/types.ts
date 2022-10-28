import { TFunction } from "react-i18next";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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

export interface IEditedVaultDescriptionV1 extends IBaseEditedVaultDescription {
  version: "v1";
  "vulnerability-severities-spec": IVulnerabilitySeveritiesTemplateV1;
}
export interface IEditedVaultDescriptionV2 extends IBaseEditedVaultDescription {
  version: "v2";
  "vulnerability-severities-spec": IVulnerabilitySeveritiesTemplateV2;
}

export type IEditedVaultDescription = IEditedVaultDescriptionV1 | IEditedVaultDescriptionV2;

export const getEditedDescriptionYupResolver = (intl: TFunction) => {
  const schema = Yup.object().shape({
    "project-metadata": Yup.object({
      icon: Yup.string().required(intl('required')),
      tokenIcon: Yup.string().required(intl('required')),
      website: Yup.string().required(intl('required')),
      name: Yup.string().required(intl('required')),
      type: Yup.string(),
      endtime: Yup.number(),
      starttime: Yup.number(),
    }),
  });

  return yupResolver(schema);
}