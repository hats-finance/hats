import { ISubmittedSubmission, IVault } from "@hats-finance/shared";

export const getVaultSubmissionsBySiweUser = async (
  address: string | undefined,
  submissions: ISubmittedSubmission[] | undefined,
  vaults: IVault[] | undefined
) => {
  console.log("submissions", submissions);
  console.log("vaults", vaults);
  if (!address || !vaults || !submissions) return [];
  if (vaults.length === 0) return [];
  if (submissions.length === 0) return [];

  return [];
};
