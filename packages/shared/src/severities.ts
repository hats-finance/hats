import {
  IEditedVulnerabilitySeverityV1,
  IEditedVulnerabilitySeverityV2,
  IEditedVulnerabilitySeverityV3,
  IVulnerabilitySeveritiesTemplate,
  IVulnerabilitySeveritiesTemplateV1,
  IVulnerabilitySeveritiesTemplateV2,
  IVulnerabilitySeveritiesTemplateV3,
} from "./types";

export enum SeverityTemplate {
  base = "base",
  gas = "gas",
  fv = "fv",
  fvgas = "fvgas",
  aiSafety = "aisafety",
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
export const IndexToPointsInfo_ais = {
  15: {
    severityAllocation: 100,
    capPerPoint: "",
    points: {
      type: "fixed",
      value: {
        first: 3,
      },
    },
  }, // Adversarial Robustness
  12: {
    severityAllocation: 100,
    capPerPoint: "",
    points: {
      type: "fixed",
      value: {
        first: 3,
      },
    },
  }, // Explainability & Interpretability
  11: {
    severityAllocation: 100,
    capPerPoint: "",
    points: {
      type: "fixed",
      value: {
        first: 3,
      },
    },
  }, // Alignment & Control
  10: {
    severityAllocation: 100,
    capPerPoint: "",
    points: {
      type: "fixed",
      value: {
        first: 2,
      },
    },
  }, // Fairness & Bias Mitigation
  9: {
    severityAllocation: 100,
    capPerPoint: "",
    points: {
      type: "fixed",
      value: {
        first: 3,
      },
    },
  }, // Security & Privacy
  8: {
    severityAllocation: 100,
    capPerPoint: "",
    points: {
      type: "fixed",
      value: {
        first: 2,
      },
    },
  }, // Data Integrity & Bias
};

export const convertVulnerabilitySeverityV1ToV2V3 = (
  severity: IEditedVulnerabilitySeverityV1,
  indexArray?: number[],
  isAudit: boolean = false,
  template: SeverityTemplate = SeverityTemplate.base
): IEditedVulnerabilitySeverityV2 | IEditedVulnerabilitySeverityV3 => {
  const newSeverity = { ...severity } as any;
  delete newSeverity.index;

  const IndexToPointsInfo = {
    base: IndexToPointsInfo_base,
    gas: IndexToPointsInfo_withgas,
    fv: IndexToPointsInfo_withfv,
    fvgas: IndexToPointsInfo_withfvgas,
    aisafety: IndexToPointsInfo_ais
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
  "adversarial-robustness":{
    id: "adversarial-robustness",
    decryptSubmissions: true,
    name: "Adversarial Robustness",
    index: 7,
    "contracts-covered": [],
    "nft-metadata": {
      "name": "Adversarial Defender",
      "description": "Identified a vulnerability to adversarial attacks",
      "animation_url": "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/adversarial_robustness_animation.mp4",
      "image": "ipfs://QmQWgcpU5qR8SxKRtL5DX8CjpP46XpZwXvHutpEtnLFWEa/adversarial_robustness_image.jpg",
      "external_url": ""
    },
    "description": "This category focuses on evaluating the model's resilience against adversarial attacks, where inputs are intentionally manipulated to cause the model to misbehave or produce incorrect outputs.\n\n**Valid Submission:**\n\n* **Report:** Detailed description of the adversarial attack method used, the model's vulnerability to this attack, and the potential consequences of such an attack.\n* **Adversarial Examples:** Specific input examples demonstrating the successful manipulation of the model's output.\n* **Defense Recommendations:** Suggestions for techniques or strategies that could be implemented to enhance the model's robustness against adversarial attacks.\n\n**Assessment Criteria:**\n\n* **Severity:** The potential impact of successful adversarial attacks on the model's intended application.\n* **Novelty:** The originality and effectiveness of the adversarial attack method used.\n* **Defense Feasibility:** The practicality and feasibility of the proposed defense recommendations.\n\n**Reward Allocation:**\n\n*"
  },
  "explainability-interpretability":{
    "id": "explainability-interpretability",
    "decryptSubmissions": true,
    "name": "Explainability & Interpretability",
    "index": 11,
    "contracts-covered": [],
    "nft-metadata": {
      "name": "AI X-Ray Visionary",
      "description": "Unveiled the inner workings of the AI",
      "animation_url": "ipfs://[HASH]/explainability_animation.mp4",
      "image": "ipfs://[HASH]/explainability_image.jpg",
      "external_url": ""
    },
    "description": "This category focuses on evaluating the transparency and understandability of the model's decision-making process.\n\n**Valid Submission:**\n\n* **Report:** An analysis of the model's explainability using appropriate methods (e.g., LIME, SHAP, feature importance).\n* **Visualizations:** Clear and informative visualizations (e.g., saliency maps, decision trees) that illustrate the model's reasoning process.\n* **Improvement Suggestions:** Recommendations for enhancing the model's transparency, such as using more interpretable model architectures or developing additional explainability techniques.\n\n**Assessment Criteria:**\n\n* **Clarity and Insight:** The clarity and insightfulness of the provided explanations.\n* **Methodological Soundness:** The appropriateness and validity of the explainability methods used.\n* **Practicality of Suggestions:** The feasibility and potential impact of the suggested improvements on enhancing the model's interpretability.\n\n**Reward Allocation:**\n\n*"
  },
  "alignment-control":{
    "id": "alignment-control",
    "decryptSubmissions": true,
    "name": "Alignment & Control",
    "index": 14,
    "contracts-covered": [],
    "nft-metadata": {
      "name": "AI Harmonizer",
      "description": "Ensured AI aligns with human values",
      "animation_url": "ipfs://[HASH]/alignment_animation.mp4",
      "image": "ipfs://[HASH]/alignment_image.jpg",
      "external_url": ""
    },
    "description": "This category focuses on evaluating the alignment of the AI model's behavior with human values and objectives, as well as the effectiveness of mechanisms for human oversight and control.\n\n**Valid Submission:**\n\n* **Report:** Analysis of the model's alignment with intended objectives, potential unintended consequences, and the robustness of control mechanisms.\n* **Test Scenarios:** Examples of scenarios where the model's behavior might deviate from desired outcomes or raise ethical concerns.\n* **Control Recommendations:** Suggestions for improving human oversight and control, such as implementing kill switches, human-in-the-loop systems, or more robust safety constraints.\n\n**Assessment Criteria:**\n\n* **Alignment Analysis:** The depth and accuracy of the alignment analysis, considering potential risks and unintended consequences.\n* **Control Effectiveness:** The feasibility and effectiveness of the proposed control mechanisms in mitigating identified risks.\n* **Ethical Considerations:** The consideration of ethical implications and potential societal impact of the model's deployment. \n\n**Reward Allocation:**\n\n* **25%** of the total reward pool allocated to this category."
  },
  "fairness-bias-mitigation":{
    "id": "fairness-bias-mitigation",
    "decryptSubmissions": true,
    "name": "Fairness & Bias Mitigation",
    "index": 4,
    "contracts-covered": [],
    "nft-metadata": {
      "name": "AI Equality Advocate",
      "description": "Identified and addressed bias in the AI",
      "animation_url": "ipfs://[HASH]/fairness_animation.mp4",
      "image": "ipfs://[HASH]/fairness_image.jpg",
      "external_url": ""
    },
    "description": "This category focuses on evaluating the fairness of the AI model's outcomes and its potential for bias towards certain groups or individuals.\n\n**Valid Submission:**\n\n* **Report:** An analysis of the model's fairness using relevant metrics (e.g., demographic parity, equalized odds) and identification of potential biases in training data or model outputs.\n* **Bias Examples:** Concrete examples demonstrating potential bias in the model's predictions or behavior.\n* **Mitigation Strategies:** Recommendations for techniques or approaches to mitigate identified biases, such as data augmentation, algorithmic adjustments, or fairness-aware training methods.\n\n**Assessment Criteria:**\n\n* **Bias Identification:** The accuracy and comprehensiveness of the bias analysis, considering various demographic groups and potential sources of bias.\n* **Mitigation Effectiveness:** The potential impact of the proposed mitigation strategies on improving fairness and reducing bias.\n* **Ethical Considerations:** The consideration of ethical implications and potential societal consequences of biased AI systems.\n\n**Reward Allocation:**\n\n* **15%** of the total reward pool allocated to this category."
  },
  "security-privacy":{
    "id": "security-privacy",
    "decryptSubmissions": true,
    "name": "Security & Privacy",
    "index": 5,
    "contracts-covered": [],
    "nft-metadata": {
      "name": "AI Data Guardian",
      "description": "Protected AI data and prevented leaks",
      "animation_url": "ipfs://[HASH]/security_animation.mp4",
      "image": "ipfs://[HASH]/security_image.jpg",
      "external_url": ""
    },
    "description": "This category focuses on evaluating the security of the AI model and the protection of sensitive data used for training or inference.\n\n**Valid Submission:**\n\n* **Report:** An analysis of the model's security vulnerabilities, including potential data leaks, model extraction attacks, or unauthorized access to the model itself.\n* **Vulnerability Demonstrations:** Practical demonstrations of identified security vulnerabilities, if applicable.\n* **Security Recommendations:** Specific suggestions for enhancing the model's security and protecting sensitive data, such as implementing encryption, access controls, or privacy-preserving techniques.\n\n**Assessment Criteria:**\n\n* **Severity of Vulnerabilities:** The potential impact of the identified security vulnerabilities on data privacy, model integrity, or system security.\n* **Novelty:** The originality of the identified vulnerabilities and the proposed mitigation strategies.\n* **Practicality and Feasibility:** The practicality and feasibility of implementing the suggested security recommendations.\n\n**Reward Allocation:**\n\n* **15%** of the total reward pool allocated to this category."
  },
  "data-integrity-bias":{
    "id": "data-integrity-bias",
    "decryptSubmissions": true,
    "name": "Data Integrity & Bias",
    "index": 6,
    "contracts-covered": [],
    "nft-metadata": {
      "name": "Data Detective",
      "description": "Uncovered hidden flaws in the AI's training data",
      "animation_url": "ipfs://[HASH]/data_integrity_animation.mp4",
      "image": "ipfs://[HASH]/data_integrity_image.jpg",
      "external_url": ""
    },
    "description": "This category focuses on evaluating the quality and integrity of the training dataset used to develop the AI model, specifically targeting the identification of problematic data points that could introduce bias, inaccuracies, or ethical concerns. **Due to the sensitive nature of this category, participants will be required to sign a non-disclosure agreement (NDA) and will only be granted access to a representative sample of the training dataset.**\n\n**Valid Submission:**\n\n* **Report:** A detailed report identifying specific problematic data points within the training dataset, categorized by the type of issue (e.g., factual errors, labeling errors, biased content, sensitive information).\n* **Data Point Index:** Clear identification of the problematic data points within the dataset (e.g., row numbers, unique identifiers), allowing for easy verification and analysis.\n* **Impact Analysis:** An assessment of the potential impact of the problematic data points on the model's performance, fairness, or ethical implications.\n* **Mitigation Recommendations:** Suggestions for addressing the identified issues, such as data cleaning, correction, removal, or augmentation techniques.\n\n**Assessment Criteria:**\n\n* **Quantity and Severity of Issues:** The number and severity of problematic data points identified, considering their potential impact on the model's performance and ethical considerations.\n* **Accuracy of Identification:** The accuracy and validity of the identified data points, ensuring they genuinely represent issues within the dataset. \n* **Impact Analysis:** The depth and insightfulness of the impact analysis, demonstrating a clear understanding of the potential consequences of using the flawed data.\n* **Mitigation Feasibility:** The practicality and feasibility of the proposed mitigation recommendations, considering their potential effectiveness and cost.\n\n**Reward Allocation:**\n\n* **10%** of the total reward pool allocated to this category."
  }
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
  version: "v1" | "v2" | "v3",
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
    aisafety:[
      AUDIT_SEVERITIES_V1["adversarial-robustness"],
      AUDIT_SEVERITIES_V1["explainability-interpretability"],
      AUDIT_SEVERITIES_V1["alignment-control"],
      AUDIT_SEVERITIES_V1["fairness-bias-mitigation"],
      AUDIT_SEVERITIES_V1["security-privacy"],
      AUDIT_SEVERITIES_V1["data-integrity-bias"]
    ]
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
  } else if (version === "v2") {
    const baseTemplate = { ...templateToUse } as any;
    delete baseTemplate.indexArray;

    const baseTemplateV2: IVulnerabilitySeveritiesTemplateV2 = {
      ...(baseTemplate as IVulnerabilitySeveritiesTemplateV2),
      severities: templateToUse.severities.map((severity) =>
        convertVulnerabilitySeverityV1ToV2V3(severity, indexArray, useAuditTemplate, template)
      ),
    };

    return baseTemplateV2;
  } else {
    const baseTemplate = { ...templateToUse } as any;
    delete baseTemplate.indexArray;

    const baseTemplateV3: IVulnerabilitySeveritiesTemplateV3 = {
      ...(baseTemplate as IVulnerabilitySeveritiesTemplateV3),
      severities: templateToUse.severities.map((severity) =>
        convertVulnerabilitySeverityV1ToV2V3(severity, indexArray, useAuditTemplate, template)
      ),
    };

    return baseTemplateV3;
  }
};
