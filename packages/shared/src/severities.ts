import { v4 as uuid } from "uuid";
import {
  IEditedVulnerabilitySeverityV1,
  IEditedVulnerabilitySeverityV2,
  IVulnerabilitySeveritiesTemplate,
  IVulnerabilitySeveritiesTemplateV1,
  IVulnerabilitySeveritiesTemplateV2,
} from "./types";

export const convertVulnerabilitySeverityV1ToV2 = (
  severity: IEditedVulnerabilitySeverityV1,
  indexArray?: number[]
): IEditedVulnerabilitySeverityV2 => {
  const newSeverity = { ...severity } as any;
  delete newSeverity.index;

  return {
    ...newSeverity,
    percentage: indexArray && indexArray[severity.index] ? indexArray[severity.index] / 100 : NaN,
  };
};

export const getVulnerabilitySeveritiesTemplate = (
  version: "v1" | "v2",
  useAuditTemplate = false
): IVulnerabilitySeveritiesTemplate => {
  const indexArray = [
    0, 10, 20, 70, 150, 250, 300, 400, 500, 600, 1000, 1200, 1400, 1800, 2000, 2500, 3000, 4000, 5000, 6000, 8000,
  ];

  const auditTemplateV1: IVulnerabilitySeveritiesTemplateV1 = {
    name: "Default Template",
    indexArray,
    severities: [
      {
        id: uuid(),
        name: "gas saving",
        index: 7,
        "contracts-covered": [],
        "nft-metadata": {
          name: "Good citizen",
          description: "Vault low severity reward",
          animation_url: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
          image: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
          external_url: "",
        },
        description:
          "This competition will reward participants with ideas to maximize gas savings. The prize pool will reward $Xk for first place and $Yk for second place. The guidelines are as follows: \n - Submissions should be forks of our repository, with the test suite unchanged. \n - Optimizations should use solidity (no inline assembly) \n - Entries will be measured on the total average amount of gas used for each function (i.e. the sum of all numbers in the “avg” column), as reported by the hardhat-gas-reporter when running the tests in the repository. It's possible to use the script at (Add your GitHub repo, example) to sum up the averages.",
      },
      {
        id: uuid(),
        name: "medium",
        index: 14,
        "contracts-covered": [],
        "nft-metadata": {
          name: "Protocol protector",
          description: "Vault medium severity reward",
          animation_url:
            "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
          image: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
          external_url: "",
        },
        description:
          "Issues where the behavior of the contracts differs from the intended behavior (as described in the docs and by common sense). Each issue gets 1 point. The total Medium severity reward will be divided between all accepted issues",
      },
      {
        id: uuid(),
        name: "high",
        index: 16,
        "contracts-covered": [],
        "nft-metadata": {
          name: "Protocol champion",
          description: "Vault high severity reward",
          animation_url: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",
          image: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",

          external_url: "",
        },
        description:
          "Issues that put user's funds at risk (ex: an attacker can steal funds from a vault, or users are not able to withdraw their token). Each issue gets 1 point. The total High severity reward will be divided between all accepted issues",
      },
    ],
  };

  const baseTemplateV1: IVulnerabilitySeveritiesTemplateV1 = {
    name: "Default Template",
    indexArray,
    severities: [
      {
        id: uuid(),
        name: "Low Severity",
        index: 7,
        "contracts-covered": [],
        "nft-metadata": {
          name: "Good citizen",
          description: "Vault low severity reward",
          animation_url: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
          image: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
          external_url: "",
        },
        description:
          "Contract does not function as expected, with no loss of funds. Prize will be capped to 5% of the amount that could be frozen, extracted or at risk in production at the time of disclosure.",
      },
      {
        id: uuid(),
        name: "Medium Severity",
        index: 14,
        "contracts-covered": [],
        "nft-metadata": {
          name: "Protocol protector",
          description: "Vault medium severity reward",
          animation_url:
            "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
          image: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
          external_url: "",
        },
        description:
          "Contract consumes unbounded gas,block stuffing, griefing denial of service (i.e. attacker spends as much in gas as damage to the contract), gas griefing. Prize will be capped to 20% of the amount that could be frozen, extracted or at risk in production at the time of disclosure.",
      },
      {
        id: uuid(),
        name: "High Severity",
        index: 16,
        "contracts-covered": [],
        "nft-metadata": {
          name: "Protocol champion",
          description: "Vault high severity reward",
          animation_url: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",
          image: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",

          external_url: "",
        },
        description:
          "Token holders temporarily unable to transfer holdings ,users spoof each other, theft of yield - Transient consensus failures. Prize will be capped to 30% of the amount that could be frozen, extracted or at risk in production at the time of disclosure.",
      },
      {
        id: uuid(),
        name: "Critical Severity",
        index: 20,
        "contracts-covered": [],
        "nft-metadata": {
          name: "Protocol savior",
          description: "Vault critical severity reward",
          animation_url:
            "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Critical-Swarm%20of%20Thoughts.mp4",
          image: "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Critical-Swarm%20of%20Thoughts.mp4",

          external_url: "",
        },
        description:
          "Empty or freeze the contract's holdings (e.g. economic attacks, flash loans, reentrancy, MEV, logic errors, integer over-/under-flow), Cryptographic flaws. Prize will be capped to the amount that could be frozen, extracted or at risk in production at the time of disclosure.",
      },
    ],
  };

  const templateToUse = useAuditTemplate ? auditTemplateV1 : baseTemplateV1;

  if (version === "v1") {
    return baseTemplateV1;
  } else {
    const baseTemplate = { ...templateToUse } as any;
    delete baseTemplate.indexArray;

    const baseTemplateV2: IVulnerabilitySeveritiesTemplateV2 = {
      ...(baseTemplate as IVulnerabilitySeveritiesTemplateV2),
      severities: templateToUse.severities.map((severity) => convertVulnerabilitySeverityV1ToV2(severity, indexArray)),
    };

    return baseTemplateV2;
  }
};
