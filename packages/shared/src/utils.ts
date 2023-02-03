import { v4 as uuid } from "uuid";
import { ICommitteeMember, IVaultDescription } from "./";
import { getVulnerabilitySeveritiesTemplate } from "./severities";
import {
  ICreateVaultOnChainCall,
  IEditedCommunicationEmail,
  IEditedContractCovered,
  IEditedVaultDescription,
  IEditedVaultParameters,
  IEditedVulnerabilitySeverity,
  IEditedVulnerabilitySeverityV1,
  IEditedVulnerabilitySeverityV2,
  IVulnerabilitySeveritiesTemplate,
  IVulnerabilitySeverity,
  IVulnerabilitySeverityV1,
  IVulnerabilitySeverityV2,
} from "./types";

export const COMMITTEE_CONTROLLED_SPLIT = 85;
export const HATS_GOV_SPLIT = 10;
export const HATS_REWARD_SPLIT = 5;

export const createNewCommitteeMember = (owner?: string, linkedMultisig?: string): ICommitteeMember => ({
  name: "",
  address: owner ?? "",
  linkedMultisigAddress: linkedMultisig ?? "",
  "twitter-link": "",
  "image-ipfs-link": "",
  "pgp-keys": [{ publicKey: "" }],
});

export const createNewCoveredContract = (sevIds?: string[]): IEditedContractCovered => {
  const severitiesIds = sevIds ? [...sevIds] : [];
  severitiesIds.sort();

  return {
    name: "",
    address: "",
    severities: severitiesIds,
  };
};

export const createNewVulnerabilitySeverity = (version: "v1" | "v2"): IEditedVulnerabilitySeverity => {
  const editedVulnerabilitySeverityBase = {
    id: uuid(),
    name: "",
    "contracts-covered": [],
    "nft-metadata": {
      name: "",
      description: "",
      animation_url: "",
      image: "",
      external_url: "",
    },
    description: "",
  };

  if (version === "v1") {
    return {
      ...editedVulnerabilitySeverityBase,
      index: 0,
    } as IEditedVulnerabilitySeverityV1;
  } else {
    return {
      ...editedVulnerabilitySeverityBase,
      percentage: 0,
    } as IEditedVulnerabilitySeverityV2;
  }
};

const getDefaultVaultParameters = (): IEditedVaultParameters => {
  return {
    fixedCommitteeControlledPercetange: COMMITTEE_CONTROLLED_SPLIT,
    fixedHatsGovPercetange: HATS_GOV_SPLIT,
    fixedHatsRewardPercetange: HATS_REWARD_SPLIT,
    committeePercentage: 5,
    immediatePercentage: 35,
    vestedPercentage: 60,
    maxBountyPercentage: 90,
  };
};

export const createNewVaultDescription = (version: "v1" | "v2"): IEditedVaultDescription => {
  const vulnerabilitySeveritiesTemplate = getVulnerabilitySeveritiesTemplate(version);
  const severitiesIds = vulnerabilitySeveritiesTemplate.severities.map((s) => s.id as string);
  const severitiesOptionsForContractsCovered = vulnerabilitySeveritiesTemplate.severities.map(
    (s: IEditedVulnerabilitySeverity) => ({
      label: s.name,
      value: s.id as string,
    })
  );

  return {
    version,
    "project-metadata": {
      name: "",
      icon: "",
      tokenIcon: "",
      website: "",
      type: "",
      emails: [{ address: "", status: "unverified" }] as IEditedCommunicationEmail[],
    },
    committee: {
      chainId: "",
      "multisig-address": "",
      members: [] as ICommitteeMember[],
    },
    "contracts-covered": [{ ...createNewCoveredContract(severitiesIds) }],
    "vulnerability-severities-spec": vulnerabilitySeveritiesTemplate,
    assets: [{ address: "", symbol: "" }],
    parameters: getDefaultVaultParameters(),
    source: {
      name: "",
      url: "",
    },
    severitiesOptions: severitiesOptionsForContractsCovered,
    includesStartAndEndTime: false,
  } as IEditedVaultDescription;
};

function severitiesToContractsCoveredForm(severities: IEditedVulnerabilitySeverity[]): IEditedContractCovered[] {
  let contractsForm = [] as IEditedContractCovered[];

  severities.forEach((severity) => {
    const contractsCovered = severity["contracts-covered"];

    if (contractsCovered && contractsCovered.length > 0) {
      contractsCovered.forEach((contractCovered) => {
        const name = Object.keys(contractCovered)[0];
        const address = Object.values(contractCovered)[0] as string;
        const contract = contractsForm.find((c) => c.name === name && c.address === address);

        if (contract) {
          const contractIndex = contractsForm.indexOf(contract);
          contractsForm[contractIndex] = {
            name,
            address,
            severities: [...contract.severities, severity.id as string],
          };
        } else {
          contractsForm.push({
            name,
            address,
            severities: [severity.id as string],
          });
        }
      });
    } else {
      contractsForm.push({
        ...createNewCoveredContract(),
        severities: [severity.id as string],
      });
    }
  });

  return contractsForm;
}

export function descriptionToEditedForm(vaultDescription: IVaultDescription): IEditedVaultDescription {
  const severitiesWithIds: IEditedVulnerabilitySeverity[] = vaultDescription.severities.map((sev) => ({
    ...sev,
    id: uuid(),
  }));

  const severitiesOptions = severitiesWithIds.map((s) => ({
    label: s.name,
    value: s.id as string,
  }));

  if (vaultDescription.version === "v1" || !vaultDescription.version) {
    return {
      ...vaultDescription,
      version: "v1",
      "project-metadata": {
        ...vaultDescription["project-metadata"],
        emails: [],
      },
      committee: {
        ...vaultDescription.committee,
        chainId: "",
      },
      "vulnerability-severities-spec": {
        severities: severitiesWithIds as IEditedVulnerabilitySeverityV1[],
        name: "",
        indexArray: vaultDescription.indexArray,
      },
      "contracts-covered": severitiesToContractsCoveredForm(severitiesWithIds),
      assets: [],
      parameters: {
        fixedCommitteeControlledPercetange: 0,
        fixedHatsGovPercetange: 0,
        fixedHatsRewardPercetange: 0,
        committeePercentage: 0,
        immediatePercentage: 0,
        vestedPercentage: 0,
        maxBountyPercentage: 0,
      },
      severitiesOptions,
      includesStartAndEndTime: !!vaultDescription["project-metadata"].starttime || !!vaultDescription["project-metadata"].endtime,
    };
  }

  return {
    ...vaultDescription,
    version: "v2",
    "project-metadata": {
      ...vaultDescription["project-metadata"],
      emails: [],
    },
    committee: {
      ...vaultDescription.committee,
      chainId: "",
    },
    "vulnerability-severities-spec": {
      severities: severitiesWithIds as IEditedVulnerabilitySeverityV2[],
      name: "",
    },
    "contracts-covered": severitiesToContractsCoveredForm(severitiesWithIds),
    assets: [],
    parameters: {
      fixedCommitteeControlledPercetange: 0,
      fixedHatsGovPercetange: 0,
      fixedHatsRewardPercetange: 0,
      committeePercentage: 0,
      immediatePercentage: 0,
      vestedPercentage: 0,
      maxBountyPercentage: 0,
    },
    severitiesOptions,
    includesStartAndEndTime: !!vaultDescription["project-metadata"].starttime || !!vaultDescription["project-metadata"].endtime,
  };
}

function editedSeveritiesToSeverities(severities: IEditedVulnerabilitySeverityV1[], contractsCovered: IEditedContractCovered[]) {
  return severities.map((severity) => {
    const newSeverity = { ...severity };

    const severityId = newSeverity.id as string;
    if (newSeverity.id) delete newSeverity.id;
    return {
      ...newSeverity,
      "contracts-covered": contractsCovered
        .filter((contract) => contract.severities?.includes(severityId))
        .map((contract) => ({ [contract.name]: contract.address })),
    };
  }) as IVulnerabilitySeverityV1[];
}

function editedSeveritiesToSeveritiesv2(
  severities: IEditedVulnerabilitySeverityV2[],
  contractsCovered: IEditedContractCovered[]
) {
  return severities.map((severity) => {
    const newSeverity = { ...severity };

    const severityId = newSeverity.id as string;
    if (newSeverity.id) delete newSeverity.id;
    return {
      ...newSeverity,
      "contracts-covered": contractsCovered
        .filter((contract) => contract.severities?.includes(severityId))
        .map((contract) => ({ [contract.name]: contract.address })),
    };
  }) as IVulnerabilitySeverityV2[];
}

export function editedFormToDescription(editedVaultDescription: IEditedVaultDescription): IVaultDescription {
  // remove emails
  const { emails, ...projectMetadata } = editedVaultDescription["project-metadata"];
  if (editedVaultDescription.version === "v1") {
    return {
      version: editedVaultDescription.version,

      "project-metadata": projectMetadata,
      "communication-channel": editedVaultDescription["communication-channel"],
      committee: editedVaultDescription.committee,
      source: editedVaultDescription.source,
      severities: editedSeveritiesToSeverities(
        editedVaultDescription["vulnerability-severities-spec"].severities,
        editedVaultDescription["contracts-covered"]
      ),
    };
  } else {
    return {
      version: editedVaultDescription.version,
      "project-metadata": projectMetadata,
      "communication-channel": editedVaultDescription["communication-channel"],
      committee: editedVaultDescription.committee,
      source: editedVaultDescription.source,
      severities: editedSeveritiesToSeveritiesv2(
        editedVaultDescription["vulnerability-severities-spec"].severities,
        editedVaultDescription["contracts-covered"]
      ),
    };
  }
}

export function fixObject(description: any): IVaultDescription {
  if ("Project-metadata" in description) {
    description["project-metadata"] = description["Project-metadata"];
    delete description["Project-metadata"];
  }
  if ("gamification" in description["project-metadata"] && description["project-metadata"].gamification) {
    description["project-metadata"].type = "gamification";
  }
  return description;
}

export function editedFormToCreateVaultOnChainCall(
  editedVaultDescription: IEditedVaultDescription,
  descriptionHash: string
): ICreateVaultOnChainCall {
  const convertStringToSlug = (str: string) =>
    str
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  const formatPercentage = (percentage: number) => +(percentage.toString().split(".")[0] + "00");

  const { maxBountyPercentage, immediatePercentage, vestedPercentage, committeePercentage } = editedVaultDescription.parameters;

  return {
    chainId: +editedVaultDescription.committee.chainId,
    asset: editedVaultDescription.assets[0].address,
    name: convertStringToSlug(editedVaultDescription["project-metadata"].name),
    symbol: convertStringToSlug(editedVaultDescription["project-metadata"].name),
    committee: editedVaultDescription.committee["multisig-address"],
    owner: editedVaultDescription.committee["multisig-address"],
    rewardController: "0x0000000000000000000000000000000000000000",
    maxBounty: formatPercentage(maxBountyPercentage),
    bountySplit: {
      committee: formatPercentage(committeePercentage),
      hacker: formatPercentage(immediatePercentage),
      hackerVested: formatPercentage(vestedPercentage),
    },
    vestingDuration: 2592000,
    vestingPeriods: 30,
    isPaused: false,
    descriptionHash,
  } as ICreateVaultOnChainCall;
}
