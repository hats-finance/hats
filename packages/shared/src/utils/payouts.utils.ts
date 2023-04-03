import { IPayoutData } from "../types";

export const createNewPayoutData = (): IPayoutData => {
  return {
    beneficiary: "",
    title: "",
    severity: "",
    percentageToPay: "",
    explanation: "",
    nftUrl: "",
    additionalInfo: "Submission tx: \n\nSubmission link: \n\nDecrypted submission:",
  };
};
