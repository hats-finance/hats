import { IPayoutData, ISubmittedSubmission, IVaultInfo, PayoutType } from "@hats.finance/shared";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { readPrivateKeyFromStoredKey, useKeystore } from "components/Keystore";
import { IndexedDBs } from "config/DBConfig";
import { useSubmissions } from "hooks/subgraph/submissions/useSubmissions";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { decrypt, readMessage } from "openpgp";
import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import uuidFromString from "uuid-by-string";
import { useAccount } from "wagmi";
import * as SubmissionsService from "./submissionsService.api";
import { extractSubmissionData } from "./submissionsService.api";

export const useVaultSubmissionsByKeystore = (
  disabled = false
): { data: ISubmittedSubmission[]; isLoading: boolean; loadingProgress: number } => {
  const { address } = useAccount();
  const { allVaults, vaultsReadyAllChains } = useVaults();
  const { allSubmissions, submissionsReadyAllChains } = useSubmissions();
  const { update: addToDecryptedSubmissionsDB, getAll: getAllDecryptedSubmissionsDB } = useIndexedDB(
    IndexedDBs.DecryptedSubmissions
  );
  const { keystore } = useKeystore();
  const userKeys = keystore?.storedKeys;

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionsFromKeystore, setSubmissionsFromKeystore] = useState<ISubmittedSubmission[]>();

  useEffect(() => {
    if (disabled) return;
    if (submissionsFromKeystore !== undefined) return;
    if (!vaultsReadyAllChains || !submissionsReadyAllChains) return;
    if (!address || !allVaults || !allSubmissions) return;
    if (allVaults.length === 0) return;
    if (allSubmissions.length === 0) return;
    if (!userKeys || userKeys.length === 0) {
      setIsLoading(false);
      return;
    }

    const checkSubmissions = async () => {
      try {
        const submissionsFromDB = (await getAllDecryptedSubmissionsDB()) as ISubmittedSubmission[];
        submissionsFromDB.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
        if (submissionsFromDB && submissionsFromDB.length > 0) {
          setSubmissionsFromKeystore(submissionsFromDB as ISubmittedSubmission[]);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log(error);
      }

      setLoadingProgress(0);
      const submissionsForCommittee: ISubmittedSubmission[] = [];

      for (const [idx, submission] of allSubmissions.entries()) {
        if (allSubmissions.length === idx + 1) setLoadingProgress(100);
        else setLoadingProgress((idx / allSubmissions.length) * 100);

        if (!submission.submissionData) continue;

        let decryptedPart = "";
        let encryptedPart = "";

        //TODO: private audits V2 (verify is decryptedPart is encrypted with hats public key)
        if (typeof submission.submissionData === "object") {
          decryptedPart = submission.submissionData.decrypted ?? "";
          encryptedPart = submission.submissionData.encrypted ?? "";
        } else {
          encryptedPart = submission.submissionData as string;
        }

        // Iterate over all stored keys and try to decrypt the message
        for (const keypair of userKeys) {
          try {
            const privateKey = await readPrivateKeyFromStoredKey(keypair.privateKey, keypair.passphrase);
            const message = await readMessage({ armoredMessage: encryptedPart });

            const { data: decrypted } = await decrypt({
              message,
              decryptionKeys: privateKey,
            });

            const decryptedMessage = (decrypted as string) + (decryptedPart ? `\n\n${decryptedPart}` : "");
            submissionsForCommittee.push(...extractSubmissionData(submission, decryptedMessage, allVaults));
            break;
          } catch (error) {
            // console.log(error);
            continue;
          }
        }
      }

      submissionsForCommittee.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
      const submissionsWithSubId = submissionsForCommittee.map((submission) => ({
        ...submission,
        subId: uuidFromString(submission.id + submission.submissionDecrypted),
      }));

      setIsLoading(false);

      try {
        for (const sub of submissionsWithSubId) await addToDecryptedSubmissionsDB(sub);
      } catch (error) {
        console.log(error);
      }
      setSubmissionsFromKeystore(submissionsWithSubId);
    };
    checkSubmissions();
  }, [
    address,
    disabled,
    userKeys,
    allVaults,
    allSubmissions,
    vaultsReadyAllChains,
    submissionsFromKeystore,
    submissionsReadyAllChains,
    getAllDecryptedSubmissionsDB,
    addToDecryptedSubmissionsDB,
  ]);

  if (disabled) return { isLoading: false, data: [], loadingProgress: 0 };
  return { isLoading, data: submissionsFromKeystore ?? [], loadingProgress };
};

// MUTATIONS
export const useCreatePayoutFromSubmissions = (): UseMutationResult<
  string,
  unknown,
  { vaultInfo: IVaultInfo; type: PayoutType; payoutData: IPayoutData },
  unknown
> => {
  return useMutation({
    mutationFn: ({ vaultInfo, type, payoutData }) => SubmissionsService.createPayoutFromSubmissions(vaultInfo, type, payoutData),
  });
};
