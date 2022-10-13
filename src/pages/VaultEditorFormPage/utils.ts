import { ICommitteeMember, IVaultDescription, IVulnerabilitySeverity } from "types/types";
import { severitiesTemplate } from "./severities";
import { IEditedContractCovered, IEditedVaultDescription } from "./types";

export const newMember: ICommitteeMember = {
    name: "",
    address: "",
    "twitter-link": "",
    "image-ipfs-link": "",
};

const newContract: IEditedContractCovered = {
    name: "",
    address: "",
    severities: [],
};

export const newVaultDescription: IEditedVaultDescription = {
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
        members: [{ ...newMember }],
    },
    "contracts-covered": [{ ...newContract }],
    "severitiesTemplate": severitiesTemplate,
    source: {
        name: "",
        url: "",
    },
};


function severitiesToContracts(severities: IVulnerabilitySeverity[]): IEditedContractCovered[] {
    let contracts = [] as IEditedContractCovered[];
    severities.forEach((severity) => {
        const contractsCovered = severity["contracts-covered"]?.length === 0 ? [newContract] : severity["contracts-covered"];
        contractsCovered.forEach((item) => {
            const name = Object.keys(item)[0];
            const address = Object.values(item)[0] as string;
            let contract = contracts.find((item) => item.name === name && item.address === address);
            if (contract) {
                let contractIndex = contracts.indexOf(contract);
                contracts[contractIndex] = {
                    name,
                    address,
                    severities: [...contract.severities, severity.name],
                };
            } else {
                contracts.push({
                    name,
                    address,
                    severities: [severity.name],
                });
            }
        });
    });
    return contracts;
}

export function descriptionToEdit(vaultDescription: IVaultDescription): IEditedVaultDescription {
    return {
        ...vaultDescription,
        "severitiesTemplate": {
            severities: vaultDescription.severities,
            name: vaultDescription.severities[0].name,
            indexArray: vaultDescription.severities.map((item) => item.index),
        },
        "contracts-covered": severitiesToContracts(vaultDescription.severities),
        "source": vaultDescription.source,
        "additional-vaults": vaultDescription["additional-vaults"],
    };
}

export function editedToDescription(editVaultDescription: IEditedVaultDescription) {
    const vaultName = editVaultDescription["project-metadata"].name;
    return {
        ...editVaultDescription,
        severities: editVaultDescription.severitiesTemplate.severities.map((severity) => ({
            ...severity,
            "nft-metadata": {
                ...severity["nft-metadata"],
                description: vaultName + severity["nft-metadata"].description,
            },
            "contracts-covered": editVaultDescription["contracts-covered"]
                .filter((contract) => {
                    return contract.severities.includes(severity.name);
                })
                .map((contract) => ({ [contract.name]: contract.address })),
        }))
    };
}