export interface IPayoutResponse {
  _id: string;
  vaultAddress: string;
  chainId: number;
  payoutData: IPayoutData;
  nonce: number;
  txToSign: string;
  minSignaturesNeeded: number;
  signatures: IPayoutSignature[];
  status: PayoutStatus;
  lastActionNeededNotifiedAt: Date;
  payoutTxHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPayoutData {
  beneficiary: string;
  title: string;
  severity: string;
  percentageToPay: string;
  explanation: string;
  nftUrl: string;
  additionalInfo: string;
  reportTxid?: string; // Future
  reportDate?: Date; // Future
  encryptedMessage?: string; // Future
  decryptedMessage?: string; // Future
}

export interface IPayoutSignature {
  signature: string;
  signedAt: Date;
  signerAddress: string;
  membersNotified: boolean;
}

export enum PayoutStatus {
  Creating = "creating",
  Pending = "pending",
  ReadyToExecute = "readyToExecute",
  UnderReview = "underReview",
  Executed = "executed",
  Rejected = "rejected",
}

export const payoutStatusInfo = {
  [PayoutStatus.Creating]: {
    label: "creating",
    color: "--warning-yellow",
  },
  [PayoutStatus.Pending]: {
    label: "collecting",
    color: "--warning-yellow",
  },
  [PayoutStatus.ReadyToExecute]: {
    label: "waitingExecution",
    color: "--turquoise",
  },
  [PayoutStatus.UnderReview]: {
    label: "underReview",
    color: "--teal",
  },
  [PayoutStatus.Executed]: {
    label: "executed",
    color: "--turquoise",
  },
  [PayoutStatus.Rejected]: {
    label: "rejected",
    color: "--error-red",
  },
};
