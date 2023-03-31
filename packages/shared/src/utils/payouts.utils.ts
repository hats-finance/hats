import { IPayoutData } from "../types";

export const createNewPayoutData = (): IPayoutData => {
  return {
    beneficiary: "",
    title: "",
    severity: "",
    percentageToPay: "",
    explanation: "",
    nftUrl: "",
    additionalInfo: "Submission tx: \nSubmission link: \nDecrypted submission:",
  };
};
