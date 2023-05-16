import { BASE_SERVICE_URL } from "settings";
import { ISubmissionData, ISubmissionsDescriptionsData } from "../../types";

export const getAuditSubmissionTexts = (
  submissionData: ISubmissionData,
  descriptions: ISubmissionsDescriptionsData["descriptions"]
) => {
  const toEncrypt = `**Communication channel:** ${submissionData.contact?.communicationChannel} (${submissionData.contact?.communicationChannelType})`;
  const decrypted = `**Project Name:** ${submissionData.project?.projectName}
**Project Id:** ${submissionData.project?.projectId}
**Beneficiary:** ${submissionData.contact?.beneficiary}
**Github username:** ${submissionData.contact?.githubUsername ?? "---"}
    
    ${descriptions
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
