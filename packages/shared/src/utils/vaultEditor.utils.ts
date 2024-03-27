import { v4 as uuid } from "uuid";
import { ChainsConfig, ICommitteeMember, IVaultDescription } from "..";
import { getVulnerabilitySeveritiesTemplate } from "../severities";
import {
  IBaseVulnerabilitySeverity,
  ICreateVaultOnChainCall,
  IEditedCommunicationEmail,
  IEditedContractCovered,
  IEditedVaultDescription,
  IEditedVaultParameters,
  IEditedVulnerabilitySeverity,
  IEditedVulnerabilitySeverityV1,
  IEditedVulnerabilitySeverityV2,
  IEditedVulnerabilitySeverityV3,
  IProtocolSetupInstructions,
  IVulnerabilitySeverityV1,
  IVulnerabilitySeverityV2,
} from "../types";

export const DEFAULT_OUT_OF_SCOPE =
  "Reporters will not receive a bounty for:\n\n* Any known issue, such as:\n  * Issues that are mentioned in any of the audit reports [LINK TO AUDIT REPORT].\n  * Vulnerabilities that were already made public (either by the project or by a third party)\n* Vulnerabilities that are exploited by the reporter themselves.\n* Attacks requiring access to leaked private keys or trusted addresses.\n* Issues that are not responsibly disclosed (issues should typically be reported through our platform).";
export const DEFAULT_TOOLING_STEPS: IProtocolSetupInstructions = {
  tooling: "hardhat",
  instructions:
    "### Usage\n\nInstallation:\n```\nnpm install\n```\n\nCreate `.env` files as needed. There is a file called `.env.example` that you can use as a template.\n\nRun the tests:\n```\nnpx hardhat test\n```",
};
export const DEFAULT_IN_SCOPE =
  "## Project overview\n\nWrite here a brief project overview. What's the goal and vision of the project, main feature, and functionality?\n\n## Audit competition scope\n\nPut here a list of all the folders/files that are inside the scope of this audit competition.\n\n```\n|-- project/\n     |-- README.md\n     |-- file001.txt   \n     |-- folder1\n          |-- file011.txt\n          |-- file012.txt\n               |-- subfolder1\n                    |-- file111.txt\n                    |-- file112.txt\n     |-- folder2\n           |-- file021.txt\n           |-- file022.txt\n```";

export const CODE_LANGUAGES = {
  solidity: ["solidity", "cairo", "go", "rust", "vyper", "simplicity"],
  other: ["javascript", "typescript", "python", "react"],
};

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
    deploymentInfo: [{ contractAddress: "", chainId: "" }],
  };
};

export const createNewVulnerabilitySeverity = (version: "v1" | "v2" | "v3"): IEditedVulnerabilitySeverity => {
  const editedVulnerabilitySeverityBase = {
    id: uuid(),
    name: "",
    "contracts-covered": [],
    contractsCoveredNew: [],
    "nft-metadata": {
      name: "",
      description: "",
      animation_url: "",
      image: "",
      external_url: "",
    },
    description: "",
  } as IBaseVulnerabilitySeverity;

  if (version === "v1") {
    return {
      ...editedVulnerabilitySeverityBase,
      index: 0,
    } as IEditedVulnerabilitySeverityV1;
  } else if (version === "v2") {
    return {
      ...editedVulnerabilitySeverityBase,
      percentage: 0,
      points: {
        type: "fixed",
        value: {
          first: 0,
        },
      },
    } as IEditedVulnerabilitySeverityV2;
  } else {
    return {
      ...editedVulnerabilitySeverityBase,
      percentage: 0,
      points: {
        type: "fixed",
        value: {
          first: 0,
        },
      },
    } as IEditedVulnerabilitySeverityV3;
  }
};

export const getDefaultVaultParameters = (isAudit = false): IEditedVaultParameters => {
  return {
    fixedCommitteeControlledPercetange: undefined,
    fixedHatsGovPercetange: undefined,
    fixedHatsRewardPercetange: undefined,
    committeePercentage: isAudit ? 0 : 0,
    immediatePercentage: isAudit ? 100 : 40,
    vestedPercentage: isAudit ? 0 : 60,
    maxBountyPercentage: 90,
  };
};

export const createNewVaultDescription = (version: "v1" | "v2" | "v3"): IEditedVaultDescription => {
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
      type: undefined,
      emails: [{ address: "", status: "unverified" }] as IEditedCommunicationEmail[],
    },
    scope: {
      reposInformation: [{ isMain: true, url: "", commitHash: "" }],
      description: DEFAULT_IN_SCOPE,
      codeLangs: [] as string[],
      docsLink: "",
      outOfScope: "",
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

export function severitiesToContractsCoveredForm(severities: IEditedVulnerabilitySeverity[]): IEditedContractCovered[] {
  let contractsForm = [] as IEditedContractCovered[];

  severities.forEach((severity) => {
    const contractsCovered =
      severity.contractsCoveredNew !== undefined ? severity.contractsCoveredNew : severity["contracts-covered"];

    if (contractsCovered && contractsCovered.length > 0) {
      contractsCovered.forEach((contractCovered) => {
        const address = contractCovered.link ?? (Object.values(contractCovered)[0] as string);
        const contract = contractsForm.find((c) => c.address === address);

        const data =
          severity.contractsCoveredNew !== undefined
            ? {
                name: "",
                address,
                linesOfCode: contractCovered.linesOfCode as number,
                deploymentInfo: contractCovered.deploymentInfo as IEditedContractCovered["deploymentInfo"],
              }
            : { ...createNewCoveredContract(), name: Object.keys(contractCovered)[0], address };

        if (contract) {
          const contractIndex = contractsForm.indexOf(contract);
          contractsForm[contractIndex] = {
            ...data,
            severities: [...contract.severities, severity.id as string],
          };
        } else {
          contractsForm.push({
            ...data,
            severities: [severity.id as string],
          });
        }
      });
    }
    // else {
    //   contractsForm.push({
    //     ...createNewCoveredContract(),
    //     severities: [severity.id as string],
    //   });
    // }
  });

  return contractsForm;
}

export function descriptionToEditedForm(vaultDescription: IVaultDescription, withDefaultData = false): IEditedVaultDescription {
  const severitiesWithIds: IEditedVulnerabilitySeverity[] = vaultDescription.severities.map((sev) => ({
    ...sev,
    id: uuid(),
  }));

  const severitiesOptions = severitiesWithIds.map((s) => ({
    label: s.name,
    value: s.id as string,
  }));

  const defaultDescription = createNewVaultDescription("v1");

  const baseEditedDescription = {
    ...vaultDescription,
    committee: {
      ...vaultDescription.committee,
      members: vaultDescription.committee.members
        ? withDefaultData
          ? vaultDescription.committee.members.map((m) => ({
              ...m,
              "pgp-keys": m["pgp-keys"] ? m["pgp-keys"] : [{ publicKey: "" }],
            }))
          : vaultDescription.committee.members
        : [createNewCommitteeMember()],
    },
    "project-metadata": {
      ...vaultDescription["project-metadata"],
      emails: withDefaultData ? [{ address: "", status: "unverified" as IEditedCommunicationEmail["status"] }] : [],
    },
    "contracts-covered": severitiesToContractsCoveredForm(severitiesWithIds),
    assets: defaultDescription.assets,
    parameters: defaultDescription.parameters,
    severitiesOptions,
    includesStartAndEndTime: !!vaultDescription["project-metadata"].starttime || !!vaultDescription["project-metadata"].endtime,
  };

  // If we are creating a editSession from a descriptionHash, we add all the pgpKeys in the old
  // format, to the new format (on the first member)
  if (withDefaultData) {
    const existingPgpKeyOrKeys = vaultDescription["communication-channel"]?.["pgp-pk"] ?? [];
    let existingPgpKeys = typeof existingPgpKeyOrKeys === "string" ? [existingPgpKeyOrKeys] : existingPgpKeyOrKeys;
    existingPgpKeys = [...existingPgpKeys, ...baseEditedDescription.committee.members[0]["pgp-keys"].map((key) => key.publicKey)];
    existingPgpKeys = [...new Set(existingPgpKeys)];

    baseEditedDescription.committee.members[0]["pgp-keys"] = existingPgpKeys?.map((key) => ({ publicKey: key })) ?? [
      { publicKey: "" },
    ];
  }

  // V1 vaults
  if (vaultDescription.version === "v1" || !vaultDescription.version) {
    return {
      ...baseEditedDescription,
      version: "v1",
      "vulnerability-severities-spec": {
        severities: severitiesWithIds as IEditedVulnerabilitySeverityV1[],
        name: "",
        indexArray: vaultDescription.indexArray,
      },
    };
  }

  // V2 vaults
  return {
    ...baseEditedDescription,
    version: "v2",
    "vulnerability-severities-spec": {
      severities: severitiesWithIds as IEditedVulnerabilitySeverityV2[],
      name: "",
    },
  };
}

function editedSeveritiesToSeverities(severities: IEditedVulnerabilitySeverityV1[], contractsCovered: IEditedContractCovered[]) {
  return severities.map((severity) => {
    const newSeverity = { ...severity };

    const severityId = newSeverity.id as string;
    if (newSeverity.id) delete newSeverity.id;
    return {
      ...newSeverity,
      // "contracts-covered": contractsCovered
      //   .filter((contract) => contract.severities?.includes(severityId))
      //   .map((contract) => ({ [contract.name]: contract.address })),
      contractsCoveredNew: contractsCovered
        .filter((contract) => contract.severities?.includes(severityId))
        .map((contract) => ({
          link: contract.address,
          linesOfCode: contract.linesOfCode,
          deploymentInfo: contract.deploymentInfo,
        })) as IBaseVulnerabilitySeverity["contractsCoveredNew"],
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
    return {
      ...newSeverity,
      // "contracts-covered": contractsCovered
      //   .filter((contract) => contract.severities?.includes(severityId))
      //   .map((contract) => ({ [contract.name]: contract.address })),
      contractsCoveredNew: contractsCovered
        .filter((contract) => contract.severities?.includes(severityId))
        .map((contract) => ({
          link: contract.address,
          linesOfCode: contract.linesOfCode,
          deploymentInfo: contract.deploymentInfo,
        })) as IBaseVulnerabilitySeverity["contractsCoveredNew"],
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
      scope: editedVaultDescription.scope,
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
      scope: editedVaultDescription.scope,
      usingPointingSystem: editedVaultDescription.usingPointingSystem,
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

  if (!description["project-metadata"].type || description["project-metadata"].type === "") {
    description["project-metadata"].type = "normal";
  }

  if (description["project-metadata"].type === "Grants") {
    description["project-metadata"].type = "grants";
  }

  if (description["project-metadata"].type === "Audit competition") {
    description["project-metadata"].type = "audit";
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

  const formatPercentage = (percentage: number) => Number(percentage) * 100;

  const { maxBountyPercentage, immediatePercentage, vestedPercentage, committeePercentage } = editedVaultDescription.parameters;

  return {
    chainId: +(editedVaultDescription.committee.chainId ?? "1"),
    asset: editedVaultDescription.assets[0].address,
    name: convertStringToSlug(editedVaultDescription["project-metadata"].name),
    symbol: convertStringToSlug(editedVaultDescription["project-metadata"].name),
    committee: editedVaultDescription.committee["multisig-address"],
    owner: editedVaultDescription.committee["multisig-address"],
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
    bountyGovernanceHAT: editedVaultDescription.parameters.fixedHatsGovPercetange ?? 2000,
    bountyHackerHATVested: editedVaultDescription.parameters.fixedHatsRewardPercetange ?? 0,
    arbitratorCanChangeBeneficiary: true,
    arbitratorCanChangeBounty: true,
    arbitratorCanSubmitClaims: true,
    isTokenLockRevocable: false,
    arbitrator: ChainsConfig[+(editedVaultDescription.committee.chainId ?? "1")].arbitratorContract,
  } as ICreateVaultOnChainCall;
}
