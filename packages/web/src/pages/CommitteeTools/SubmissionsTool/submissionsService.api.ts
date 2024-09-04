import {
  GithubIssue,
  IPayoutData,
  ISubmittedSubmission,
  IVault,
  IVaultInfo,
  PayoutType,
  severitiesOrder,
} from "@hats.finance/shared";
import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL, HATS_GITHUB_BOT_ID } from "settings";

export const extractSubmissionData = (
  submission: ISubmittedSubmission,
  decryptedMessage: string,
  allVaults: IVault[]
): ISubmittedSubmission[] => {
  const projectName = decryptedMessage.match(/(\*\*Project Name:\*\* (.*)\n)/)?.[2] ?? undefined;
  const projectId = decryptedMessage.match(/(\*\*Project Id:\*\* (.*)\n)/)?.[2] ?? undefined;
  const beneficiary = decryptedMessage.match(/(\*\*Beneficiary:\*\* (.*)\n)/)?.[2] ?? undefined;
  const githubUsername = decryptedMessage.match(/(\*\*Github username:\*\* (.*)\n)/)?.[2] ?? undefined;
  const twitterUsername = decryptedMessage.match(/(\*\*Twitter username:\*\* (.*)\n)/)?.[2] ?? undefined;
  const communicationChannelAll = decryptedMessage.match(/(\*\*Communication channel:\*\* (.*)\n)/)?.[2] ?? undefined;
  const communicationChannelValue =
    communicationChannelAll?.match(/(.*) \(/)?.[1] ??
    decryptedMessage.match(/(\*\*Telegram username:\*\* (.*)\n)/)?.[2] ??
    undefined;
  const communicationChannelType = (
    communicationChannelAll?.match(/(\(.*\))/)?.[1] ??
    (decryptedMessage.match(/(\*\*Telegram username:\*\* (.*)\n)/)?.[2] ? "telegram" : undefined)
  )
    ?.replace("(", "")
    .replace(")", "");

  // Searh first for the vault id, if not found, search for the project name
  const submissionVault =
    allVaults.find((vault) => projectId && vault.id.toLowerCase() === projectId?.toLowerCase()) ??
    allVaults.find((vault) => vault.description?.["project-metadata"].name.toLowerCase() === projectName?.toLowerCase());

  const submissions: ISubmittedSubmission[] = [];

  if (decryptedMessage.match(/(\*\*SUBMISSION #\d*\*\*)/)) {
    const extractSingleSubmission = (messageToUse: string): ISubmittedSubmission["submissionDataStructure"] => {
      return {
        beneficiary: beneficiary ?? "--",
        severity: messageToUse.match(/(\*\*Severity:\*\* (.*)\n)/)?.[2],
        title: messageToUse.match(/(\*\*Title:\*\* (.*)\n)/)?.[2] ?? "--",
        content: messageToUse ?? "--",
        githubUsername: githubUsername ?? "--",
        twitterUsername: twitterUsername ?? "--",
        communicationChannel: {
          type: communicationChannelType ?? "--",
          value: communicationChannelValue ?? "--",
        },
      };
    };

    let message = JSON.parse(JSON.stringify(decryptedMessage));
    let count = -1;
    while (true) {
      count = count + 1;
      let nextSubmission: string | undefined =
        message.match(/(\*\*SUBMISSION #\d*\*\*(.|\n)*(\*\*SUBMISSION #\d*\*\*))/g)?.[0] ?? undefined;
      if (nextSubmission) {
        nextSubmission = nextSubmission.replace(/\*\*SUBMISSION #\d*\*\*$/, "");
        submissions.push({
          ...submission,
          submissionIdx: count,
          linkedVault: submissionVault,
          submissionDecrypted: nextSubmission.trim(),
          submissionDataStructure: extractSingleSubmission(nextSubmission.trim()),
        });
        message = message.replace(nextSubmission, "");
      } else {
        const finalSubmission: string | undefined =
          message.match(/(\*\*SUBMISSION #\d*\*\*(.|\n)*(([^/]+)$))/g)?.[0] ?? undefined;
        if (finalSubmission) {
          submissions.push({
            ...submission,
            submissionIdx: count,
            linkedVault: submissionVault,
            submissionDecrypted: finalSubmission.trim(),
            submissionDataStructure: extractSingleSubmission(finalSubmission.trim()),
          });
        }
        break;
      }
    }
  } else if (decryptedMessage.match(/(-------------\n\*\*\[ISSUE #\d*\]\*\*)/)) {
    const extractSingleSubmission = (messageToUse: string): ISubmittedSubmission["submissionDataStructure"] => {
      return {
        beneficiary: beneficiary ?? "--",
        severity: messageToUse.match(/(\*\*Severity:\*\* (.*)\n)/)?.[2],
        title: messageToUse.match(/(\*\*Title:\*\* (.*)\n)/)?.[2] ?? "--",
        content: messageToUse ?? "--",
        githubUsername: githubUsername ?? "--",
        twitterUsername: twitterUsername ?? "--",
        communicationChannel: {
          type: communicationChannelType ?? "--",
          value: communicationChannelValue ?? "--",
        },
      };
    };

    let message = JSON.parse(JSON.stringify(decryptedMessage));
    let count = -1;
    while (true) {
      count = count + 1;
      let nextSubmission: string | undefined =
        message.match(/(-------------\n\*\*\[ISSUE #\d*\]\*\*(.|\n)*(-------------\n\*\*\[ISSUE #\d*\]\*\*))/g)?.[0] ?? undefined;
      if (nextSubmission) {
        nextSubmission = nextSubmission.replace(/-------------\n\*\*\[ISSUE #\d*\]\*\*$/, "").replace("-------------", "");
        submissions.push({
          ...submission,
          submissionIdx: count,
          linkedVault: submissionVault,
          submissionDecrypted: nextSubmission.trim(),
          submissionDataStructure: extractSingleSubmission(nextSubmission.trim()),
        });
        message = message.replace(nextSubmission, "");
      } else {
        const finalSubmission: string | undefined =
          message.match(/(-------------\n\*\*\[ISSUE #\d*\]\*\*(.|\n)*(([^/]+)$))/g)?.[0] ?? undefined;
        if (finalSubmission) {
          submissions.push({
            ...submission,
            submissionIdx: count,
            linkedVault: submissionVault,
            submissionDecrypted: finalSubmission.trim().replace("-------------", ""),
            submissionDataStructure: extractSingleSubmission(finalSubmission.trim().replace("-------------", "")),
          });
        }
        break;
      }
    }
  } else if (decryptedMessage.match(/(## \[ISSUE #\d*\]:)/)) {
    const extractSingleSubmission = (messageToUse: string): ISubmittedSubmission["submissionDataStructure"] => {
      const firstLine = messageToUse.match(/(## \[ISSUE #\d*\]: (.*)\n)/)?.[2];

      return {
        beneficiary: beneficiary ?? "--",
        severity: firstLine?.slice(firstLine?.lastIndexOf("(") + 1, -1),
        title: firstLine?.slice(0, firstLine.lastIndexOf("(") - 1) ?? "--",
        content: messageToUse ?? "--",
        githubUsername: githubUsername ?? "--",
        twitterUsername: twitterUsername ?? "--",
        communicationChannel: {
          type: communicationChannelType ?? "--",
          value: communicationChannelValue ?? "--",
        },
      };
    };

    const message = JSON.parse(JSON.stringify(decryptedMessage)) as string;
    const submissionsTexts = message.match(/## \[ISSUE #\d+\]:[^#]*(?:(?!## \[ISSUE #\d+\]:)[\s\S])*/g) ?? [];

    for (const [idx, submissionText] of submissionsTexts.entries()) {
      submissions.push({
        ...submission,
        submissionIdx: idx,
        linkedVault: submissionVault,
        submissionDecrypted: submissionText.trim(),
        submissionDataStructure: extractSingleSubmission(submissionText.trim()),
      });
    }
  } else {
    let message = JSON.parse(JSON.stringify(decryptedMessage));
    message = message.replace(/\*\*Telegram username:\*\* (.*)(\n|$)/, "");
    message = message.replace(/\*\*Beneficiary:\*\* (.*)(\n|$)/, "");

    submissions.push({
      ...submission,
      linkedVault: submissionVault,
      submissionDecrypted: decryptedMessage.trim(),
      submissionDataStructure: {
        beneficiary: beneficiary ?? "--",
        severity: undefined,
        title: message.match(/(\*\*Title:\*\* (.*)\n)/)?.[2] ?? "--",
        content: message ?? "--",
        githubUsername: githubUsername ?? "--",
        twitterUsername: twitterUsername ?? "--",
        communicationChannel: {
          type: communicationChannelType ?? "--",
          value: communicationChannelValue ?? "--",
        },
      },
    });
  }

  return submissions;
};

/**
 * Creates a new payout from submission/s
 * @param vaultInfo - The vault info to create the payout
 * @param type - The payout type to create
 *
 * @returns The id of the created payout
 */
export async function createPayoutFromSubmissions(
  vaultInfo: IVaultInfo,
  type: PayoutType,
  payoutData: IPayoutData
): Promise<string> {
  const res = await axiosClient.post(`${BASE_SERVICE_URL}/payouts`, {
    vaultAddress: vaultInfo.address,
    chainId: vaultInfo.chainId,
    payoutData,
    type,
  });
  return res.data.upsertedId;
}

export async function getGithubIssuesFromVault(vault: IVault): Promise<GithubIssue[]> {
  const extractTxHashFromBody = (issue: GithubIssue): any => {
    // const txHash = issue.body.match(/(0x[a-fA-F0-9]{64})/)?.[0];
    const txHash = issue.body.match(/(\*\*Submission hash \(on-chain\):\*\* (.*)\n)/)?.[2] ?? undefined;
    return txHash;
  };

  const mapGithubIssue = (issue: any): GithubIssue => {
    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      createdBy: issue.user.id,
      labels: issue.labels.map((label: any) => label.name),
      validLabels: issue.labels
        .filter((label: any) => severitiesOrder.includes((label.name as string).toLowerCase()))
        .map((label: any) => (label.name as string).toLowerCase()),
      createdAt: issue.created_at,
      body: issue.body,
      txHash: extractTxHashFromBody(issue),
    };
  };

  const res = await axiosClient.get(`${BASE_SERVICE_URL}/github-repos/gh-issues/${vault.id}`);
  const issues = res.data.githubIssues.map(mapGithubIssue) as GithubIssue[];

  return issues.filter((issue) => issue.createdBy === HATS_GITHUB_BOT_ID) ?? [];
}

export function getGhIssueFromSubmission(submission?: ISubmittedSubmission, ghIssues?: GithubIssue[]): GithubIssue | undefined {
  if (!ghIssues || !submission) return undefined;

  const sameTxHash = ghIssues.filter((issue) => issue.txHash === submission.txid);
  const sameTitle = sameTxHash.filter((issue) => issue.title === submission.submissionDataStructure?.title);

  return sameTitle[0];
}
