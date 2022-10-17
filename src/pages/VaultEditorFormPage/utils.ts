import { v4 as uuid } from "uuid";
import { ICommitteeMember, IVaultDescription, IVulnerabilitySeverity } from "types/types";
import { getVulnerabilitySeveritiesTemplate } from "./severities";
import { IEditedContractCovered, IEditedVaultDescription } from "./types";

export const createNewCommitteeMember = (): ICommitteeMember => ({
  name: "",
  address: "",
  "twitter-link": "",
  "image-ipfs-link": "",
});

export const createNewCoveredContract = (severities?: IVulnerabilitySeverity[]): IEditedContractCovered => ({
  name: "",
  address: "",
  severities: severities?.map((s) => s.id) || [],
});

export const createNewSeverity = (): IVulnerabilitySeverity => ({
  id: uuid(),
  name: "",
  index: 0,
  "contracts-covered": [],
  "nft-metadata": {
    name: "",
    description: "",
    animation_url: "",
    image: "",
    external_url: "",
  },
  description: "",
});

export const createNewVaultDescription = (): IEditedVaultDescription => {
  const vulnerabilitySeveritiesTemplate = getVulnerabilitySeveritiesTemplate();

  return {
    "project-metadata": {
      name: "",
      icon: "",
      tokenIcon: "",
      website: "",
      type: "",
    },
    "communication-channel": {
      "pgp-pk": "",
    },
    committee: {
      "multisig-address": "",
      members: [{ ...createNewCommitteeMember() }],
    },
    "contracts-covered": [{ ...createNewCoveredContract(vulnerabilitySeveritiesTemplate.severities) }],
    "vulnerability-severities-spec": vulnerabilitySeveritiesTemplate,
    source: {
      name: "",
      url: "",
    },
  };
};

function severitiesToContractsCoveredForm(severities: IVulnerabilitySeverity[]): IEditedContractCovered[] {
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
            severities: [...contract.severities, severity.id],
          };
        } else {
          contractsForm.push({
            name,
            address,
            severities: [severity.id],
          });
        }
      });
    } else {
      contractsForm.push({
        ...createNewCoveredContract(),
        severities: [severity.id],
      });
    }
  });

  return contractsForm;
}

export function descriptionToEditedForm(vaultDescription: IVaultDescription): IEditedVaultDescription {
  const severitiesWithIds = vaultDescription.severities.map(sev => ({...sev, id: uuid()}));

  return {
    ...vaultDescription,
    "vulnerability-severities-spec": {
      severities: severitiesWithIds,
      name: "",
      indexArray: vaultDescription.severities.map((item) => item.index),
    },
    "contracts-covered": severitiesToContractsCoveredForm(severitiesWithIds),
  };
}

export function editedFormToDescription(editVaultDescription: IEditedVaultDescription): IVaultDescription {
  const vaultName = editVaultDescription["project-metadata"].name;

  return {
    ...editVaultDescription,
    severities: editVaultDescription["vulnerability-severities-spec"].severities.map((severity) => ({
      ...severity,
      "nft-metadata": {
        ...severity["nft-metadata"],
        description: vaultName + severity["nft-metadata"].description,
      },
      "contracts-covered": editVaultDescription["contracts-covered"]
        .filter((contract) => contract.severities?.includes(severity.id))
        .map((contract) => ({ [contract.name]: contract.address })),
    })),
  };
}
