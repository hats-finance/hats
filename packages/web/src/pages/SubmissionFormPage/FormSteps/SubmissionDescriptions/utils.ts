import { BASE_SERVICE_URL } from "settings";
import { ISubmissionData, ISubmissionsDescriptionsData } from "../../types";

export const getAuditSubmissionTexts = (
  submissionData: ISubmissionData,
  descriptions: ISubmissionsDescriptionsData["descriptions"]
) => {
  const toEncrypt = `**Communication channel:** ${submissionData.contact?.communicationChannel} (${
    submissionData.contact?.communicationChannelType
  })
**Beneficiary:** ${submissionData.contact?.beneficiary}

  ${descriptions
    .filter((description) => description.isEncrypted)
    .map(
      (description, idx) => `
-------------
**[ISSUE #${idx + 1}]**
**Title:** ${description.title}
**Severity:** ${description.severity}
**Description:**
${description.description.trim()}
`
    )
    .join("\n")}`;

  const decrypted = `**Project Name:** ${submissionData.project?.projectName}
**Project Id:** ${submissionData.project?.projectId}
**Github username:** ${submissionData.contact?.githubUsername || "---"}
    
    ${descriptions
      .filter((description) => !description.isEncrypted)
      .map(
        (description, idx) => `
-------------
**[ISSUE #${idx + 1}]**
**Title:** ${description.title}
**Severity:** ${description.severity}
**Description:**
${description.description.trim()}
${
  description.files && description.files.length > 0
    ? `**Files:**\n${description.files.map((file) => `  - ${file.name} (${BASE_SERVICE_URL}/files/${file.ipfsHash})`).join("\n")}`
    : ""
}
`
      )
      .join("\n")}`;

  const submissionMessage = `--------[ENCRYPTED SECTION]--------\n${toEncrypt}\n\n\n--------[DECRYPTED SECTION]--------\n${decrypted}`;

  return { decrypted, toEncrypt, submissionMessage };
};

export const getBountySubmissionTexts = (
  submissionData: ISubmissionData,
  descriptions: ISubmissionsDescriptionsData["descriptions"]
) => {
  const toEncrypt = `**Project Name:** ${submissionData.project?.projectName}
**Project Id:** ${submissionData.project?.projectId}
**Beneficiary:** ${submissionData.contact?.beneficiary}
**Communication channel:** ${submissionData.contact?.communicationChannel} (${submissionData.contact?.communicationChannelType})
    
    ${descriptions
      .map(
        (description, idx) => `
-------------
**[ISSUE #${idx + 1}]**
**Title:** ${description.title}
**Severity:** ${description.severity}
**Description:**
${description.description.trim()}
`
      )
      .join("\n")}`;

  const submissionMessage = `--------[ENCRYPTED SECTION]--------\n${toEncrypt}`;

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
