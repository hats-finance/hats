import {
  IEditedVulnerabilitySeverityV1,
  IEditedVulnerabilitySeverityV2,
  IVulnerabilitySeveritiesTemplate,
  IVulnerabilitySeveritiesTemplateV1,
  IVulnerabilitySeveritiesTemplateV2,
} from "./types";

export enum SeverityTemplate {
  base = "base",
  gas = "gas",
  fv = "fv",
  fvgas = "fvgas",
}

export const DefaultIndexArray = [
  0, 10, 20, 70, 150, 200, 250, 300, 400, 500, 600, 1000, 1200, 1400, 1800, 2000, 2500, 3000, 4000, 5000, 5500, 6000, 8000,
];

export const IndexToPointsInfo_withfvgas = {
  5: {
    severityAllocation: 25,
    capPerPoint: "",
    points: {
      type: "range",
      value: {
        first: 0,
        second: 1,
      },
    },
  }, // FVV audit
  7: {
    severityAllocation: 75,
    capPerPoint: 1,
    points: {
      type: "range",
      value: {
        first: 1,
        second: 2,
      },
    },
  }, // G
  11: {
    severityAllocation: 75,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 1,
      },
    },
  }, // Low audit
  17: {
    severityAllocation: 75,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 12,
      },
    },
  }, // Med audit
  20: {
    severityAllocation: 75,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 25,
      },
    },
  }, // High audit
};

export const IndexToPointsInfo_withfv = {
  5: {
    severityAllocation: 25,
    capPerPoint: "",
    points: {
      type: "range",
      value: {
        first: 0,
        second: 1,
      },
    },
  }, // FVV audit
  11: {
    severityAllocation: 75,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 1,
      },
    },
  }, // Low audit
  17: {
    severityAllocation: 75,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 12,
      },
    },
  }, // Med audit
  20: {
    severityAllocation: 75,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 25,
      },
    },
  }, // High audit
};

export const IndexToPointsInfo_withgas = {
  7: {
    severityAllocation: 100,
    capPerPoint: 1,
    points: {
      type: "range",
      value: {
        first: 1,
        second: 2,
      },
    },
  }, // Gas audit
  11: {
    severityAllocation: 100,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 1,
      },
    },
  }, // Low audit
  17: {
    severityAllocation: 100,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 12,
      },
    },
  }, // Med audit
  20: {
    severityAllocation: 100,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 25,
      },
    },
  }, // High audit
};

export const IndexToPointsInfo_base = {
  11: {
    severityAllocation: 100,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 1,
      },
    },
  }, // Low audit
  17: {
    severityAllocation: 100,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 12,
      },
    },
  }, // Med audit
  20: {
    severityAllocation: 100,
    capPerPoint: 1,
    points: {
      type: "fixed",
      value: {
        first: 25,
      },
    },
  }, // High audit
};

export const convertVulnerabilitySeverityV1ToV2 = (
  severity: IEditedVulnerabilitySeverityV1,
  indexArray?: number[],
  isAudit: boolean = false,
  template: SeverityTemplate = SeverityTemplate.base
): IEditedVulnerabilitySeverityV2 => {
  const newSeverity = { ...severity } as any;
  delete newSeverity.index;

  const IndexToPointsInfo = {
    base: IndexToPointsInfo_base,
    gas: IndexToPointsInfo_withgas,
    fv: IndexToPointsInfo_withfv,
    fvgas: IndexToPointsInfo_withfvgas,
  };

  return {
    ...newSeverity,
    percentage: isAudit
      ? (IndexToPointsInfo[template] as any)[severity.index as number]?.severityAllocation ?? undefined
      : indexArray && indexArray[severity.index]
      ? indexArray[severity.index] / 100
      : NaN,
    points: (IndexToPointsInfo[template] as any)[severity.index as number]?.points ?? { type: "fixed", value: { first: 0 } },
    percentageCapPerPoint: (IndexToPointsInfo[template] as any)[severity.index as number]?.capPerPoint ?? undefined,
  };
};

export const AUDIT_SEVERITIES_V1: { [key: string]: IEditedVulnerabilitySeverityV1 } = {
  formalVerification: {
    id: "formal-verification-audit",
    decryptSubmissions: false,
    name: "Formal Verification",
    index: 5,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Good citizen",
      description: "Audit Formal verification reward",
      animation_url: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_animation.mp4",
      image: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_image.jpg",
      external_url: "",
    },
    description: `Researchers are given the opportunity to utilize the Certora Prover to find bugs and prove properties about the codebase. Some predefined contracts will have setup done for them and the best specs written for these contracts will be eligible for this severity prize pool.\n\nThe guidelines are as follows:\n* Submissions should be links to a directory containing the spec for the entire project. \n* Please use google drive or a similar service and attach the link to your submission. \n* Since the rules of this severity is winner takes all the submission will not be public and will only be shared with the committee. \n\n Evaluation process:\nThe evaluation will be determined by the committee using bug injections. After the contest, the bugs will be made public and injected to determine which rules are the most valuable by evaluating their code coverage. Rules that catch real bugs will also be counted.`,
  },
  gasSaving: {
    id: "gas-saving-audit",
    decryptSubmissions: false,
    name: "Gas Saving",
    index: 7,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Good citizen",
      description: "Audit Gas Saving reward",
      animation_url: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_animation.mp4",
      image: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_image.jpg",
      external_url: "",
    },
    description: `This competition will reward participants with ideas to maximize gas savings. The first place gets ⅔ (66.6%) of the prize pool, and the second place gets ⅓ (33.3%).\n\nSubmissions get classified on the basis of the average gas savings as reported by the gas reporter. The submission with the lowest average gas usage will win.\n    \nThe guidelines are as follows:\n* Changes should be limited to solidity files only. Tests should only be changed if they fail because of the changes in gas usage (e.g. tests that hardcode gas usage values).\n* Optimizations should use Solidity (no inline assembly).\n* All tests in the repository should pass.\n* The score of the submission is the total average amount of gas used for each function (i.e., the sum of all numbers in the “avg” column), as reported by the hardhat-gas-reporter when running the tests in the repository.\n* Submitters are kindly asked to include this number in their report, and can adapt this script for doing so: https://github.com/hats-finance/hats-contracts/blob/develop/gas-avg-check.py\n* Submissions should at least have a 5% improvement with respect to the original score.`,
  },
  low: {
    id: "low-audit",
    decryptSubmissions: true,
    name: "Low",
    index: 11,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Protocol protector",
      description: "Audit low severity reward",
      animation_url: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_animation.mp4",
      image: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_image.jpg",
      external_url: "",
    },
    description: `Issues where the behavior of the contracts differs from the intended behavior (as described in the docs and by common sense), but no funds are at risk.\n\n**SUBMISSION GUIDELINES:**\n\n* Submissions should be made using our Dapp.\n* You can submit one on-chain submission mentioning all issues found on the repo.\n* All new submissions will be created on the forked repo for this project on Hats: https://github.com/hats-finance\n* Please send a plain ASCII file following the following format:\n  * [TITLE]: short description of the issue.\n  * [SEVERITY]: either high, medium or low, see the rules.\n* Submission should contain at least one test demonstrating the problem and, if possible, a possible fix.\n\n**REPORT TEMPLATE**:\n\n* Description: Describe the context and the effect of the vulnerability.\n * Attack scenario: Describe how the vulnerability can be exploited. \n * Attachment:\n 1. Proof of Concept (PoC) file: You must provide a file containing a proof of concept (PoC) that demonstrates the vulnerability you have discovered. \n 2. Revised Code File (Optional): If possible, please provide a second file containing the revised code that offers a potential fix for the vulnerability. This file should include the following information:\n * Comment with clear explanation of the proposed fix.\n* The revised code with your suggested changes. \n * Any additional comments or explanations that clarify how the fix addresses the vulnerability. \n\n * Recommendation: Describe a patch or potential fix for the vulnerability.\n *Due to the nature of the audit competition mechanism, the repost will not be encrypted*  \n\n**LIMITATIONS:**\nReporters will not receive a bounty for:\n\n* Any known issue, such as:\n  * Issues mentioned in any previous audit reports\n  * Vulnerabilities that were already made public (either by HATS or by a third party)\n  * “Centralization risks” that are known and/or explicitly coded into the protocol (e.g. an administrator can upgrade crucial contracts and steal all funds)\n*  Attacks that require access to leaked private keys or trusted addresses.\n*  Issues that are not responsibly disclosed (issues should typically be reported through our platform)`,
  },
  medium: {
    id: "medium-audit",
    decryptSubmissions: true,
    name: "Medium",
    index: 17,
    "contracts-covered": [],
    "nft-metadata": {
      name: "Protocol champion",
      description: "Audit medium severity reward",
      animation_url: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_animation.mp4",
      image: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_image.jpg",
      external_url: "",
    },
    description: `Issues that lead to an economic loss but do not lead to direct loss of on-chain assets. Examples are:\n\n* Gas griefing attacks (make users overpay for gas)\n* Attacks that make essential functionality of the contracts temporarily unusable or inaccessible.\n* Short-term freezing of user funds.\n\n**SUBMISSION GUIDELINES:**\n\n* Submissions should be made using our Dapp.\n* You can submit one on-chain submission mentioning all issues found on the repo.\n* All new submissions will be created on the forked repo for this project on Hats: https://github.com/hats-finance\n* Please send a plain ASCII file following the following format:\n  * [TITLE]: short description of the issue.\n  * [SEVERITY]: either high, medium or low, see the rules.\n* Submission should contain at least one test demonstrating the problem and, if possible, a possible fix.\n\n**REPORT TEMPLATE**:\n\n* Description: Describe the context and the effect of the vulnerability.\n * Attack scenario: Describe how the vulnerability can be exploited. \n * Attachment:\n 1. Proof of Concept (PoC) file: You must provide a file containing a proof of concept (PoC) that demonstrates the vulnerability you have discovered. \n 2. Revised Code File (Optional): If possible, please provide a second file containing the revised code that offers a potential fix for the vulnerability. This file should include the following information:\n * Comment with clear explanation of the proposed fix.\n* The revised code with your suggested changes. \n * Any additional comments or explanations that clarify how the fix addresses the vulnerability. \n\n * Recommendation: Describe a patch or potential fix for the vulnerability.\n *Due to the nature of the audit competition mechanism, the repost will not be encrypted*  \n\n**LIMITATIONS:**\nReporters will not receive a bounty for:\n\n* Any known issue, such as:\n  * Issues mentioned in any previous audit reports\n  * Vulnerabilities that were already made public (either by HATS or by a third party)\n  * “Centralization risks” that are known and/or explicitly coded into the protocol (e.g. an administrator can upgrade crucial contracts and steal all funds)\n* Attacks that require access to leaked private keys or trusted addresses.\n* Issues that are not responsibly disclosed (issues should typically be reported through our platform)`,
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
      animation_url: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_animation.mp4",
      image: "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/template_image.jpg",
      external_url: "",
    },
    description: `Issues that lead to the loss of user funds. Such issues include:\n\n* Direct theft of any user funds, whether at rest or in motion.\n* Long-term freezing of user funds.\n* Theft or long term freezing of unclaimed yield or other assets.\n* Protocol insolvency\n\n**SUBMISSION GUIDELINES:**\n\n* Submissions should be made using our Dapp.\n* You can submit one on-chain submission mentioning all issues found on the repo.\n* All new submissions will be created on the forked repo for this project on Hats: https://github.com/hats-finance\n* Please send a plain ASCII file following the following format:\n  * [TITLE]: short description of the issue.\n  * [SEVERITY]: either high, medium or low, see the rules.\n* Submission should contain at least one test demonstrating the problem and, if possible, a possible fix.\n\n**REPORT TEMPLATE**:\n\n* Description: Describe the context and the effect of the vulnerability.\n * Attack scenario: Describe how the vulnerability can be exploited. \n * Attachment:\n 1. Proof of Concept (PoC) file: You must provide a file containing a proof of concept (PoC) that demonstrates the vulnerability you have discovered. \n 2. Revised Code File (Optional): If possible, please provide a second file containing the revised code that offers a potential fix for the vulnerability. This file should include the following information:\n * Comment with clear explanation of the proposed fix.\n* The revised code with your suggested changes. \n * Any additional comments or explanations that clarify how the fix addresses the vulnerability. \n\n * Recommendation: Describe a patch or potential fix for the vulnerability.\n *Due to the nature of the audit competition mechanism, the repost will not be encrypted*  \n\n**LIMITATIONS:**\nReporters will not receive a bounty for:\n\n* Any known issue, such as:\n  * Issues mentioned in any previous audit reports\n  * Vulnerabilities that were already made public (either by HATS or by a third party)\n  * “Centralization risks” that are known and/or explicitly coded into the protocol (e.g. an administrator can upgrade crucial contracts and steal all funds)\n* Attacks that require access to leaked private keys or trusted addresses.\n* Issues that are not responsibly disclosed (issues should typically be reported through our platform)`,
  },
};

export const BOUNTY_SEVERITIES_V1: { [key: string]: IEditedVulnerabilitySeverityV1 } = {
  low: {
    id: "low-bounty",
    decryptSubmissions: false,
    name: "Low",
    index: 8,
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
    index: 15,
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
    index: 17,
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
    index: 22,
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
  useAuditTemplate = false,
  template: SeverityTemplate = SeverityTemplate.base
): IVulnerabilitySeveritiesTemplate => {
  const indexArray = DefaultIndexArray;

  const auditSeverities = {
    base: [AUDIT_SEVERITIES_V1["low"], AUDIT_SEVERITIES_V1["medium"], AUDIT_SEVERITIES_V1["high"]],
    gas: [
      AUDIT_SEVERITIES_V1["gasSaving"],
      AUDIT_SEVERITIES_V1["low"],
      AUDIT_SEVERITIES_V1["medium"],
      AUDIT_SEVERITIES_V1["high"],
    ],
    fv: [
      AUDIT_SEVERITIES_V1["formalVerification"],
      AUDIT_SEVERITIES_V1["low"],
      AUDIT_SEVERITIES_V1["medium"],
      AUDIT_SEVERITIES_V1["high"],
    ],
    fvgas: [
      AUDIT_SEVERITIES_V1["formalVerification"],
      AUDIT_SEVERITIES_V1["gasSaving"],
      AUDIT_SEVERITIES_V1["low"],
      AUDIT_SEVERITIES_V1["medium"],
      AUDIT_SEVERITIES_V1["high"],
    ],
  };

  const auditTemplateV1: IVulnerabilitySeveritiesTemplateV1 = {
    name: template,
    indexArray,
    severities: auditSeverities[template],
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
      severities: templateToUse.severities.map((severity) =>
        convertVulnerabilitySeverityV1ToV2(severity, indexArray, useAuditTemplate, template)
      ),
    };

    return baseTemplateV2;
  }
};
