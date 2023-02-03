import {
  CommitteeDetailsForm,
  CommitteeMembersList,
  ContractsCoveredList,
  VaultAssetsList,
  VaultDetailsForm,
  VaultFormReview,
  VaultParametersForm,
  VulnerabilitySeveritiesList,
} from ".";
import { SetupReview } from "./SetupSteps/SetupReview/SetupReview";

type IEditorStepDisabledOption = "needsAccount";

export type IEditorSections = {
  [key: string]: {
    id: string;
    title: string;
    name: string;
    steps: IEditorSectionsStep[];
  };
};

export type IEditorSectionsStep = {
  id: string;
  name: string;
  title: string;
  nextButtonTextKey?: string;
  isAdvanced?: boolean;
  isInvisible?: boolean;
  isValid?: boolean;
  isChecked?: boolean;
  formFields: string[];
  disabledOptions?: IEditorStepDisabledOption[];
  component: React.FC;
};

export const AllEditorSections: IEditorSections = {
  setup: {
    id: "setup",
    title: "vaultDescription",
    name: "vaultSetup",
    steps: [
      {
        id: "details",
        name: "details",
        title: "vaultDescription",
        component: VaultDetailsForm,
        formFields: ["project-metadata"],
      },
      {
        id: "committee",
        name: "committee",
        title: "committeeDetails",
        component: CommitteeDetailsForm,
        formFields: ["committee.chainId", "committee.multisig-address"],
      },
      {
        id: "members",
        name: "members",
        title: "committeeMembersAndEncryption",
        component: CommitteeMembersList,
        formFields: ["committee.members"],
      },
      {
        id: "severities",
        name: "severities",
        title: "severities",
        component: VulnerabilitySeveritiesList,
        formFields: ["vulnerability-severities-spec"],
        isAdvanced: true,
      },
      {
        id: "contracts",
        name: "contracts",
        title: "contractsAssetsCovered",
        component: ContractsCoveredList,
        formFields: ["contracts-covered"],
      },
      {
        id: "setupReview",
        name: "setupReview",
        title: "vaultDescription",
        isInvisible: true,
        component: SetupReview,
        formFields: [],
        nextButtonTextKey: "continueToVaultCreation",
      },
    ],
  },
  deploy: {
    id: "deploy",
    title: "vaultCreator",
    name: "vaultDeployment",
    steps: [
      {
        id: "assets",
        name: "assets",
        title: "createVaultOnChain",
        component: VaultAssetsList,
        formFields: ["assets"],
      },
      {
        id: "params",
        name: "parameters",
        title: "vaultParameters",
        component: VaultParametersForm,
        formFields: ["parameters"],
      },
      {
        id: "preview",
        name: "preview",
        title: "vaultPreview",
        component: VaultFormReview,
        formFields: [],
        nextButtonTextKey: "createVaultOnChain",
        disabledOptions: ["needsAccount"],
      },
    ],
  },
};
