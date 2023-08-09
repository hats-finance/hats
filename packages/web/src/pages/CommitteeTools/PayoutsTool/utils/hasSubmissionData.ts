import { IPayoutResponse } from "@hats-finance/shared";

export const hasSubmissionData = (payout: IPayoutResponse | undefined) => {
  return (
    (payout?.payoutData.type === "single" && !!payout?.payoutData.submissionData) ||
    (payout?.payoutData.type === "split" && !!payout?.payoutData.beneficiaries[0].submissionData) ||
    false
  );
};
