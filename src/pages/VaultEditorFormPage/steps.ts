import {
  CommitteeDetailsForm,
  CommitteeMembersList,
  ContractsCoveredList,
  VaultDetailsForm,
  VulnerabilitySeveritiesList,
} from ".";
import { SetupReview } from "./SetupSteps/SetupReview/SetupReview";

export type IEditorSections = {
  [key: string]: {
    name: string;
    steps: IEditorSectionsStep[];
  };
};

export type IEditorSectionsStep = {
  id: string;
  name: string;
  title: string;
  isAdvanced?: boolean;
  isInvisible?: boolean;
  isValid?: boolean;
  isChecked?: boolean;
  formFields?: string[];
  component: React.FC;
};

export const AllEditorSections: IEditorSections = {
  setup: {
    name: "Vault Description",
    steps: [
      {
        id: "details",
        name: "Details",
        title: "Vault description",
        component: VaultDetailsForm,
        formFields: ["project-metadata"],
      },
      {
        id: "committee",
        name: "Committee",
        title: "Committee details",
        component: CommitteeDetailsForm,
        formFields: ["committee.multisig-address"],
      },
      {
        id: "members",
        name: "Members",
        title: "Committee members and Encryption keys",
        component: CommitteeMembersList,
        formFields: ["committee.members"],
      },
      {
        id: "severities",
        name: "Severities",
        title: "Severities",
        component: VulnerabilitySeveritiesList,
        formFields: ["vulnerability-severities-spec"],
        isAdvanced: true,
      },
      {
        id: "contracts",
        name: "Contracts",
        title: "Contracts/Assets covered",
        component: ContractsCoveredList,
        formFields: ["contracts-covered"],
      },
      {
        id: "setupReview",
        name: "Setup Review",
        title: "Vault description",
        isInvisible: true,
        component: SetupReview,
        formFields: undefined,
      },
      // { name: "Review", title: "Vault review", component: VaultFormReview },
    ],
  },
  deploy: {
    name: "Create a Vault",
    steps: [
      {
        id: "assets",
        name: "Assets",
        title: "Create a Vault on-chain",
        component: VaultDetailsForm,
        formFields: [""],
      },
      {
        id: "params",
        name: "Parameters",
        title: "Vault parameters",
        component: VaultDetailsForm,
        formFields: [""],
      },
      {
        id: "preview",
        name: "Preview",
        title: "Preview Vault",
        component: VaultDetailsForm,
        formFields: [""],
      },
    ],
  },
};
