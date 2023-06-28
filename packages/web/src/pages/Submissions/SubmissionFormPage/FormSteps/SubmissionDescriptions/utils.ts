import { BASE_SERVICE_URL } from "settings";
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
  descriptions: ISubmissionsDescriptionsData["descriptions"]
) => {
  const toEncrypt = `**Communication channel:** ${submissionData.contact?.communicationChannel} (${
    submissionData.contact?.communicationChannelType
  })\n
**Beneficiary:** ${submissionData.contact?.beneficiary}

  ${descriptions
    .filter((description) => description.isEncrypted)
    .map(
      (description, idx) => `
## [ISSUE #${idx + 1}]: ${description.title} (${
        description.severity.includes("severity") ? description.severity : `${description.severity} severity`
      })\n
${description.description.trim()}
##`
    )
    .join("\n")}`;

  const decrypted = `**Project Name:** ${submissionData.project?.projectName}\n
**Project Id:** ${submissionData.project?.projectId}\n
**Github username:** ${submissionData.contact?.githubUsername || "---"}
    
    ${descriptions
      .filter((description) => !description.isEncrypted)
      .map(
        (description, idx) => `
## [ISSUE #${idx + 1}]: ${description.title} (${
          description.severity.includes("severity") ? description.severity : `${description.severity} severity`
        })\n
${description.description.trim()}
${
  description.files && description.files.length > 0
    ? `**Files:**\n${description.files.map((file) => `  - ${file.name} (${BASE_SERVICE_URL}/files/${file.ipfsHash})`).join("\n")}`
    : ""
}
##`
      )
      .join("\n")}`;

  const submissionMessage = `\`\`\`\n> [ENCRYPTED SECTION]\n\`\`\`\n\n${toEncrypt}\n\n\n \`\`\`\n> [DECRYPTED SECTION]\n\`\`\`\n\n${decrypted}`;

  return { decrypted, toEncrypt, submissionMessage };
};

export const getBountySubmissionTexts = (
  submissionData: ISubmissionData,
  descriptions: ISubmissionsDescriptionsData["descriptions"]
) => {
  const toEncrypt = `**Project Name:** ${submissionData.project?.projectName}\n
**Project Id:** ${submissionData.project?.projectId}\n
**Beneficiary:** ${submissionData.contact?.beneficiary}\n
**Communication channel:** ${submissionData.contact?.communicationChannel} (${submissionData.contact?.communicationChannelType})
    
    ${descriptions
      .map(
        (description, idx) => `
## [ISSUE #${idx + 1}]: ${description.title} (${
          description.severity.includes("severity") ? description.severity : `${description.severity} severity`
        })\n
${description.description.trim()}
##`
      )
      .join("\n")}`;

  const submissionMessage = `\`\`\`\n> [ENCRYPTED SECTION]\n\`\`\`\n\n${toEncrypt}`;

  return { decrypted: undefined, toEncrypt, submissionMessage };
};

export const getGithubIssueDescription = (
  submissionData: ISubmissionData,
  description: ISubmissionsDescriptionsData["descriptions"][0]
) => {
  return `
**Github username:** ${submissionData.contact?.githubUsername ? `@${submissionData.contact?.githubUsername}` : "--"}
**Submission hash (on-chain):** ${submissionData.submissionResult?.transactionHash}
**Severity:** ${description.severity}

**Description:**
${description.description.trim()}
  
${
  description.files && description.files.length > 0
    ? `**Files:**\n${description.files.map((file) => `  - ${file.name} (${BASE_SERVICE_URL}/files/${file.ipfsHash})`).join("\n")}`
    : ""
}
`;
};
