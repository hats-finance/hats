import { IVault } from "@hats-finance/shared";
import { Dispatch, SetStateAction, createContext } from "react";
import { ISubmissionData } from "./types";

const packageJSON = require("../../../../package.json");

export interface ISubmissionFormContext {
  currentStep?: number;
  vault: IVault | undefined;
  isSigningSubmission: boolean;
  isSubmitting: boolean;
  submissionData: ISubmissionData | undefined;
  setSubmissionData: Dispatch<SetStateAction<ISubmissionData | undefined>>;
  setCurrentStep: Dispatch<SetStateAction<number | undefined>>;
  submitSubmission: Function;
  sendSubmissionToServer: Function;
  reset: Function;
}

export const SubmissionFormContext = createContext<ISubmissionFormContext>(undefined as any);

export const SUBMISSION_INIT_DATA = {
  version: packageJSON.version,
  submissionsDescriptions: {
    verified: false,
    submissionMessage: "",
    submission: "",
    descriptions: [
      {
        isEncrypted: true,
        title: "",
        description: "",
        severity: "",
        files: [],
        sessionKey: "" as any,
      },
    ],
  },
};
