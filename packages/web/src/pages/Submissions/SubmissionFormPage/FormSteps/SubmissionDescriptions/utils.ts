import { IPFS_PREFIX } from "constants/constants";
import { BASE_SERVICE_URL } from "settings";
import { IHackerProfile } from "types";
import { ISubmissionData, ISubmissionsDescriptionsData } from "../../types";

export const SUBMISSION_DESCRIPTION_TEMPLATE = `**Description**\\
Describe the context and the effect of the vulnerability.

**Attack Scenario**\\
Describe how the vulnerability can be exploited.

**Attachments**

1. **Proof of Concept (PoC) File**
<!-- You must provide a file containing a proof of concept (PoC) that demonstrates the vulnerability you have discovered. -->

2. **Revised Code File (Optional)**
<!-- If possible, please provide a second file containing the revised code that offers a potential fix for the vulnerability. This file should include the following information:
- Comment with a clear explanation of the proposed fix.
- The revised code with your suggested changes.
- Any additional comments or explanations that clarify how the fix addresses the vulnerability. -->`;

export const getAuditSubmissionTexts = (
  submissionData: ISubmissionData,
  descriptions: ISubmissionsDescriptionsData["descriptions"],
  hackerProfile: IHackerProfile | undefined
) => {
  const toEncrypt = `**Communication channel:** ${submissionData.contact?.communicationChannel} (${
    submissionData.contact?.communicationChannelType
  })\n
**Beneficiary:** ${submissionData.contact?.beneficiary}

  ${descriptions
    .filter((description) => description.isEncrypted)
    .map((description, idx) =>
      description.type === "new"
        ? `
## [ISSUE #${idx + 1}]: ${description.title} (${description.severity})\n
${description.description.trim()}
##`
        : `
## [ISSUE #${idx + 1}]: COMPLEMENTARY [Issue #${description.complementGhIssueNumber}] ${description.complementGhIssue?.title}\n\n
### Fix files
${description.complementFixFiles.map((file) => `  - ${file.path} (${IPFS_PREFIX}/${file.file.ipfsHash})`).join("\n")}\n
### Test files
${description.complementTestFiles.map((file) => `  - ${file.path} (${IPFS_PREFIX}/${file.file.ipfsHash})`).join("\n")}
##`
    )
    .join("\n")}`;

  const decrypted = `**Project Name:** ${submissionData.project?.projectName}\n
**Project Id:** ${submissionData.project?.projectId}\n
**Github username:** ${submissionData.contact?.githubUsername || "---"}\n
**Twitter username:** ${submissionData.contact?.twitterUsername || "---"}\n
**HATS Profile:** ${hackerProfile ? `@${hackerProfile?.username}` : "---"}
    
    ${descriptions
      .filter((description) => !description.isEncrypted)
      .map((description, idx) =>
        description.type === "new"
          ? `
## [ISSUE #${idx + 1}]: ${description.title} (${description.severity})\n
${description.description.trim()}
${
  description.files && description.files.length > 0
    ? `**Files:**\n${description.files.map((file) => `  - ${file.name} (${BASE_SERVICE_URL}/files/${file.ipfsHash})`).join("\n")}`
    : ""
}
##`
          : `
## [ISSUE #${idx + 1}]: COMPLEMENTARY [Issue #${description.complementGhIssueNumber}] ${description.complementGhIssue?.title}\n\n
### Fix files
${description.complementFixFiles.map((file) => `  - ${file.path} (${IPFS_PREFIX}/${file.file.ipfsHash})`).join("\n")}\n
### Test files ${description.testNotApplicable ? "(NOT APPLICABLE) " : ""}
${description.complementTestFiles.map((file) => `  - ${file.path} (${IPFS_PREFIX}/${file.file.ipfsHash})`).join("\n")}
##`
      )
      .join("\n")}`;

  const submissionMessage = `\`\`\`\n> [ENCRYPTED SECTION]\n\`\`\`\n\n${toEncrypt}\n\n\n \`\`\`\n> [DECRYPTED SECTION]\n\`\`\`\n\n${decrypted}`;

  return {
    decrypted: decrypted as string,
    toEncrypt: toEncrypt as string,
    submissionMessage: submissionMessage as string,
  };
};

export const getBountySubmissionTexts = (
  submissionData: ISubmissionData,
  descriptions: ISubmissionsDescriptionsData["descriptions"],
  hackerProfile: IHackerProfile | undefined
) => {
  const toEncrypt = `**Project Name:** ${submissionData.project?.projectName}\n
**Project Id:** ${submissionData.project?.projectId}\n
**Beneficiary:** ${submissionData.contact?.beneficiary}\n
**HATS Profile:** ${hackerProfile ? `@${hackerProfile?.username}` : "---"}\n
**Communication channel:** ${submissionData.contact?.communicationChannel} (${submissionData.contact?.communicationChannelType})
    
    ${descriptions
      .map(
        (description, idx) => `
## [ISSUE #${idx + 1}]: ${description.title} (${description.severity})\n
${description.description.trim()}
##`
      )
      .join("\n")}`;

  const submissionMessage = `\`\`\`\n> [ENCRYPTED SECTION]\n\`\`\`\n\n${toEncrypt}`;

  return {
    decrypted: undefined,
    toEncrypt: toEncrypt as string,
    submissionMessage: submissionMessage as string,
  };
};

export const getGithubIssueDescription = (
  submissionData: ISubmissionData,
  description: ISubmissionsDescriptionsData["descriptions"][0],
  hackerProfile: IHackerProfile | undefined
) => {
  if (description.type === "new") {
    return `${submissionData.ref === "audit-wizard" ? "***Submitted via auditwizard.io***\n" : ""}
  **Github username:** ${submissionData.contact?.githubUsername ? `@${submissionData.contact?.githubUsername}` : "--"}
  **Twitter username:** ${submissionData.contact?.twitterUsername ? `${submissionData.contact?.twitterUsername}` : "--"}
  **HATS Profile:** ${hackerProfile ? `@${hackerProfile?.username}` : "---"}
  **Submission hash (on-chain):** ${submissionData.submissionResult?.transactionHash}
  **Severity:** ${description.severity}
  
  **Description:**
  ${description.description.trim()}
    
  ${
    description.files && description.files.length > 0
      ? `**Files:**\n${description.files
          .map((file) => `  - ${file.name} (${BASE_SERVICE_URL}/files/${file.ipfsHash})`)
          .join("\n")}`
      : ""
  }
  `;
  }

  return `**Github username:** ${submissionData.contact?.githubUsername ? `@${submissionData.contact?.githubUsername}` : "--"}
**Twitter username:** ${submissionData.contact?.twitterUsername ? `${submissionData.contact?.twitterUsername}` : "--"}
**Submission hash (on-chain):** ${submissionData.submissionResult?.transactionHash}

**Description:**
### Fix files
${description.complementFixFiles.map((file) => `  - ${file.path} (${IPFS_PREFIX}/${file.file.ipfsHash})`).join("\n")}\n
### Test files ${description.testNotApplicable ? "(NOT APPLICABLE) " : ""}
${description.complementTestFiles.map((file) => `  - ${file.path} (${IPFS_PREFIX}/${file.file.ipfsHash})`).join("\n")}
##
`;
};
