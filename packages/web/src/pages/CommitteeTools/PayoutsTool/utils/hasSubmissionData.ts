import { IPayoutResponse } from "@hats-finance/shared";

export const hasSubmissionData = (payout: IPayoutResponse | undefined) => {
  return (
    (payout?.payoutData.type === "single" && !!payout?.payoutData.submissionData) ||
    (payout?.payoutData.type === "split" && !!payout?.payoutData.beneficiaries.some((b) => b.submissionData)) ||
    false
  );
};
