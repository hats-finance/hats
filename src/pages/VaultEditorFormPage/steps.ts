import {
  CommitteeDetailsForm,
  CommitteeMembersList,
  ContractsCoveredList,
  VaultDetailsForm,
  VulnerabilitySeveritiesList,
} from ".";

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
  isValid?: boolean;
  isChecked?: boolean;
  formFields: string[];
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
      },
      {
        id: "contracts",
        name: "Contracts",
        title: "Contracts/Assets covered",
        component: ContractsCoveredList,
        formFields: ["contracts-covered"],
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
