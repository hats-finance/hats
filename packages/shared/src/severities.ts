import {
  IEditedVulnerabilitySeverityV1,
  IEditedVulnerabilitySeverityV2,
  IVulnerabilitySeveritiesTemplate,
  IVulnerabilitySeveritiesTemplateV1,
  IVulnerabilitySeveritiesTemplateV2,
} from "./types";

export const DefaultIndexArray = [
  0, 10, 20, 70, 150, 250, 300, 400, 500, 600, 1000, 1200, 1400, 1800, 2000, 2500, 3000, 4000, 5000, 6000, 8000,
];

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

export const AUDIT_SEVERITIES_V1: { [key: string]: IEditedVulnerabilitySeverityV1 } = {
  gasSaving: {
    id: "gas-saving-audit",
    decryptSubmissions: false,
    name: "Gas Saving",
    index: 7,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Good citizen",
      description: "Audit Gas Saving reward",
      animation_url: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
      image: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
      external_url: "",
    },
    description: `This competition will reward participants with ideas to maximize gas savings. The first place gets ⅔ (66.6%) of the prize pool, and the second place gets ⅓ (33.3%).
    
The guidelines are as follows:
- Submissions should be forks of our repository, with the test suite unchanged.
- Optimizations should use solidity (no inline assembly).
- Entries will be measured on the total average amount of gas used for each function (i.e., the sum of all numbers in the “avg” column), as reported by the hardhat-gas-reporter when running the tests in the repository.`,
  },
  low: {
    id: "low-audit",
    decryptSubmissions: true,
    name: "Low",
    index: 14,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Protocol protector",
      description: "Audit low severity reward",
      animation_url: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
      image: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
      external_url: "",
    },
    description: `Issues where the behavior of the contracts differs from the intended behavior (as described in the docs and by common sense), but no funds are at risk.
      
SUBMISSION GUIDELINES:
- Submissions should be made using our Dapp in the “[Project] audit competition” vault.
- Please send a plain ASCII file following the following format:
[TITLE]: short description of the issue.
[SEVERITY]: either high or medium, see the rules.
- Submission should contain a PR (linked to the issue) with at least one test demonstrating the problem and, if possible, a possible fix.
      
LIMITATIONS:
Reporters will not receive a bounty for:
- Any known issue, such as:
* Issues mentioned in any previous audit reports
* Vulnerabilities that were already made public (either by HATS or by a third party)
* “Centralization risks” that are known and/or explicitly coded into the protocol (e.g. an administrator can upgrade crucial contracts and steal all funds)
- Attacks that require access to leaked private keys or trusted addresses.
- Issues that are not responsibly disclosed (issues should typically be reported through our platform)`,
  },
  medium: {
    id: "medium-audit",
    decryptSubmissions: true,
    name: "Medium",
    index: 16,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Protocol champion",
      description: "Audit medium severity reward",
      animation_url: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",
      image: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",
      external_url: "",
    },
    description: `Issues that lead to an economic loss but do not lead to direct loss of on-chain assets. Examples are:

- Gas griefing attacks (make users overpay for gas)
- Attacks that make essential functionality of the contracts temporarily unusable or inaccessible.
- Short-term freezing of user funds.
      
SUBMISSION GUIDELINES:
- Submissions should be made using our Dapp in the “[Project] audit competition” vault.
- Please send a plain ASCII file following the following format:
[TITLE]: short description of the issue.
[SEVERITY]: either high or medium, see the rules.
- Submission should contain a PR (linked to the issue) with at least one test demonstrating the problem and, if possible, a possible fix.
      
LIMITATIONS:
Reporters will not receive a bounty for:
- Any known issue, such as:
* Issues mentioned in any previous audit reports
* Vulnerabilities that were already made public (either by HATS or by a third party)
* “Centralization risks” that are known and/or explicitly coded into the protocol (e.g. an administrator can upgrade crucial contracts and steal all funds)
- Attacks that require access to leaked private keys or trusted addresses.
- Issues that are not responsibly disclosed (issues should typically be reported through our platform)`,
  },
  high: {
    id: "high-audit",
    decryptSubmissions: true,
    name: "High",
    index: 20,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Protocol savior",
      description: "Audit high severity reward",
      animation_url: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Critical-Swarm%20of%20Thoughts.mp4",
      image: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Critical-Swarm%20of%20Thoughts.mp4",
      external_url: "",
    },
    description: `Issues that lead to the loss of user funds. Such issues include:

- Direct theft of any user funds, whether at rest or in motion.
- Long-term freezing of user funds.
- Theft or long term freezing of unclaimed yield or other assets.
- Protocol insolvency
      
SUBMISSION GUIDELINES:
- Submissions should be made using our Dapp in the “[Project] audit competition” vault.
- Please send a plain ASCII file following the following format:
[TITLE]: short description of the issue.
[SEVERITY]: either high or medium, see the rules.
- Submission should contain a PR (linked to the issue) with at least one test demonstrating the problem and, if possible, a possible fix.
      
LIMITATIONS:
Reporters will not receive a bounty for:
- Any known issue, such as:
* Issues mentioned in any previous audit reports
* Vulnerabilities that were already made public (either by HATS or by a third party)
* “Centralization risks” that are known and/or explicitly coded into the protocol (e.g. an administrator can upgrade crucial contracts and steal all funds)
- Attacks that require access to leaked private keys or trusted addresses.
- Issues that are not responsibly disclosed (issues should typically be reported through our platform)`,
  },
};

export const BOUNTY_SEVERITIES_V1: { [key: string]: IEditedVulnerabilitySeverityV1 } = {
  low: {
    id: "low-bounty",
    decryptSubmissions: false,
    name: "Low",
    index: 7,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Good citizen",
      description: "Vault Low Severity reward",
      animation_url: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
      image: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
      external_url: "",
    },
    description:
      "Contract does not function as expected, with no loss of funds. Prize will be capped to 5% of the amount that could be frozen, extracted or at risk in production at the time of disclosure.",
  },
  medium: {
    id: "medium-bounty",
    decryptSubmissions: false,
    name: "Medium",
    index: 14,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Protocol protector",
      description: "Vault Medium Severity reward",
      animation_url: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
      image: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
      external_url: "",
    },
    description:
      "Contract consumes unbounded gas,block stuffing, griefing denial of service (i.e. attacker spends as much in gas as damage to the contract), gas griefing. Prize will be capped to 20% of the amount that could be frozen, extracted or at risk in production at the time of disclosure.",
  },
  high: {
    id: "high-bounty",
    decryptSubmissions: false,
    name: "High",
    index: 16,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Protocol champion",
      description: "Vault High Severity reward",
      animation_url: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",
      image: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",

      external_url: "",
    },
    description:
      "Token holders temporarily unable to transfer holdings ,users spoof each other, theft of yield - Transient consensus failures. Prize will be capped to 30% of the amount that could be frozen, extracted or at risk in production at the time of disclosure.",
  },
  critical: {
    id: "critical-bounty",
    decryptSubmissions: false,
    name: "Critical",
    index: 20,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Protocol savior",
      description: "Vault Critical Severity reward",
      animation_url: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Critical-Swarm%20of%20Thoughts.mp4",
      image: "ipfs://QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Critical-Swarm%20of%20Thoughts.mp4",

      external_url: "",
    },
    description:
      "Empty or freeze the contract's holdings (e.g. economic attacks, flash loans, reentrancy, MEV, logic errors, integer over-/under-flow), Cryptographic flaws. Prize will be capped to the amount that could be frozen, extracted or at risk in production at the time of disclosure.",
  },
};

export const getVulnerabilitySeveritiesTemplate = (
  version: "v1" | "v2",
  useAuditTemplate = false
): IVulnerabilitySeveritiesTemplate => {
  const indexArray = DefaultIndexArray;

  const auditTemplateV1: IVulnerabilitySeveritiesTemplateV1 = {
    name: "Default Template",
    indexArray,
    severities: [
      AUDIT_SEVERITIES_V1["gasSaving"],
      AUDIT_SEVERITIES_V1["low"],
      AUDIT_SEVERITIES_V1["medium"],
      AUDIT_SEVERITIES_V1["high"],
    ],
  };

  const baseTemplateV1: IVulnerabilitySeveritiesTemplateV1 = {
    name: "Default Template",
    indexArray,
    severities: [
      BOUNTY_SEVERITIES_V1["low"],
      BOUNTY_SEVERITIES_V1["medium"],
      BOUNTY_SEVERITIES_V1["high"],
      BOUNTY_SEVERITIES_V1["critical"],
    ],
  };

  const templateToUse = useAuditTemplate ? auditTemplateV1 : baseTemplateV1;

  if (version === "v1") {
    return templateToUse;
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
