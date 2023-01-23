import { v4 as uuid } from "uuid";
import { ICommitteeMember, IVaultDescription } from "types";
import { getVulnerabilitySeveritiesTemplate } from "./severities";
import {
  IEditedContractCovered,
  IEditedVaultDescription,
  IEditedVulnerabilitySeverity,
  IEditedVulnerabilitySeverityV1,
  IEditedVulnerabilitySeverityV2,
} from "./types";

export const createNewCommitteeMember = (): ICommitteeMember => ({
  name: "Carlos Fontes",
  address: "0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6",
  "twitter-link": "@carlos",
  "image-ipfs-link": "",
  "pgp-keys": [
    {
      publicKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----

  xsBNBGDsi/sBCADzbGc9+HYUSpkHsOoGhKPOf9BGuqv0C9FXqYvkYGtI/t6/
  IkmcRGjYkQrrwRt213/Jtg8jiI/R53u2qIuuPQ67mgEReF55wghK2f3WRDqN
  RSHkSGfFiAOUvJtSMZ4yPLikip45L2O71hl1YqQLAYKH3N42mJ64/3mWI8bx
  fIv9vHF5ivokQ5c32SQYOJ5qbclT6pAYYl6EIc6GoGtWQmtOCk3b8f6bhv16
  E+tXmtWQfnz3jHXUKzQgyvxLo/nHFsH5cdYIp62qXH23BjHECFX+qRMAX12c
  zN4H/9gwjhwfO/6T6njwHmE3x8bJ/+RA7YbmBXQHbaltcbBXTTYdPKVhABEB
  AAHNHGZlZG9yYSA8ZmVkb3JhQGhhdHMuZmluYW5jZT7CwKsEEwEIAD4WIQSF
  V031QnC0+kE1MxadmLrXxXV0MwUCYOyL+wIbAwUJA8JnAAULCQgHAgYVCgkI
  CwIEFgIDAQIeAQIXgAAhCRCdmLrXxXV0MxYhBIVXTfVCcLT6QTUzFp2YutfF
  dXQzuAEH/0/I4r/9T2bUe+bboGjKNemLcgQ8y6a9KLULfMSectqV3iAKtSIC
  a/cEhmQuZo8REKCYa1k5B+Mv2xBz1KM2hfK34aXegGIDPxrTJoG0IlyF+pqd
  Xeb9u3wia36o7fNSHxRNKnCTsVQvDxmMPg176874dgKjY3YtTvljv+ihmUtR
  SMCQj3NgE2wflhYvQMDbYjqCaIruT+7uLrBlC+LI1QH1Gv3QM58t353YkAxA
  NHHuR8V/9HWRvNKC5JHuzKYx3o5cpyjSHseST5C2uikCpCtLtWQQ8kPgteGl
  Wj/6SYRzxW9F+GQdbsIk2w2A6reUghR1afgE+nTUhe0WI50QtKLOwE0EYOyL
  +wEIANWKDOKi1ebmj6AKHByNN59bN2cwuQvj4whCYCHQRHX22u7JD4C5aSVn
  cibX7GOHXJcqUEo0T54tOC6I+IFqIfg/lC+73RyTJ9FAGMoHKA+Fn2oBHNw9
  jweAaopDobFZoTwk72rQASUND4x1Xp9gR0FiDQZOfzpPgAI8Dt5se4X8zcLL
  /IlT04dyAY+qOXOoLzNQZDaeg9IBTx2S6kt1NtXHI5+YaGF4EOWiHq/RWI0B
  rmDU1+1tWgUfyCrY0iBa9JcmVSfvqNieWX8BY5OBg0jb2Oin4fuE9I34/0U8
  RNkGM8JIMNGHC2/QUlBDSYaAMR1gK/u7OixbOKkTDAIzNiMAEQEAAcLAkwQY
  AQgAJhYhBIVXTfVCcLT6QTUzFp2YutfFdXQzBQJg7Iv7AhsMBQkDwmcAACEJ
  EJ2YutfFdXQzFiEEhVdN9UJwtPpBNTMWnZi618V1dDP/UQf+OG9y8DmrUSLm
  XHsq5ANR4wtmTMUzFGacWIHxCGb/QjNvAh0oCFuyXFkxVCSUPzj/ysXCRhJD
  pX9aXua0ezCJ8P4Tr3hs6v0I9Ri+gXfMhx6EGFHEhiVn3HNSJYhB48Omr+i4
  3I+gfv2fqdJICwV4z1DZ4JlCu7B7vOm8ipZxO3SJZNJ62TKOQ5mQULkAQpIG
  O+Bqko7LQU6LOTv19X0oMBwRg9LHux/oXbU2xpfwJ5falqcORVPIgYoGnlxa
  Sb29PbeEZsiT1Qd81HmxF4Zi5f0YrAU77VYB0QylHTQbIycVoYzZmWK6Q2u8
  DRduxnVscoqNbjycLd8zQ0kbvNg2kw==
  =mxsI
  -----END PGP PUBLIC KEY BLOCK-----
  `,
    },
  ],
});

export const createNewCoveredContract = (sevIds?: string[]): IEditedContractCovered => {
  const severitiesIds = sevIds ? [...sevIds] : [];
  severitiesIds.sort();

  return {
    name: "Test contract",
    address: "0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6",
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
      name: "Test vault",
      icon: "https://ipfs.io/ipfs/QmdgiFXy9SJ5hhnADNfgLhGreb97j2r3RttLF7uGxv2NWk/TempelDAO%20logo%20.jpeg",
      tokenIcon: "https://ipfs.io/ipfs/QmdgiFXy9SJ5hhnADNfgLhGreb97j2r3RttLF7uGxv2NWk/TempelDAO%20logo%20.jpeg",
      website: "test.com",
      type: "normal",
      emails: [{ address: "carlos@test.com", status: "unverified" }],
    },
    committee: {
      "multisig-address": "0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6",
      members: [{ ...createNewCommitteeMember() }],
    },
    "contracts-covered": [{ ...createNewCoveredContract(severitiesIds) }],
    "vulnerability-severities-spec": vulnerabilitySeveritiesTemplate,
    assets: [{ address: "", chainId: "" }],
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
      "vulnerability-severities-spec": {
        severities: severitiesWithIds as IEditedVulnerabilitySeverityV1[],
        name: "",
        indexArray: vaultDescription.indexArray,
      },
      "contracts-covered": severitiesToContractsCoveredForm(severitiesWithIds),
      assets: [],
      severitiesOptions,
      includesStartAndEndTime: !!vaultDescription["project-metadata"].starttime || !!vaultDescription["project-metadata"].endtime,
    };
  }

  return {
    ...vaultDescription,
    version: "v2",
    "vulnerability-severities-spec": {
      severities: severitiesWithIds as IEditedVulnerabilitySeverityV2[],
      name: "",
    },
    "contracts-covered": severitiesToContractsCoveredForm(severitiesWithIds),
    assets: [],
    severitiesOptions,
    includesStartAndEndTime: !!vaultDescription["project-metadata"].starttime || !!vaultDescription["project-metadata"].endtime,
  };
}

export function editedFormToDescription(editedVaultDescription: IEditedVaultDescription): IVaultDescription {
  return {
    version: editedVaultDescription.version,
    "project-metadata": editedVaultDescription["project-metadata"],
    "communication-channel": editedVaultDescription["communication-channel"],
    committee: editedVaultDescription.committee,
    source: editedVaultDescription.source,
    severities: editedVaultDescription["vulnerability-severities-spec"].severities.map((severity) => {
      const newSeverity = { ...severity };

      const severityId = newSeverity.id as string;
      if (newSeverity.id) delete newSeverity.id;

      return {
        ...newSeverity,
        "contracts-covered": editedVaultDescription["contracts-covered"]
          .filter((contract) => contract.severities?.includes(severityId))
          .map((contract) => ({ [contract.name]: contract.address })),
      };
    }),
  };
}
