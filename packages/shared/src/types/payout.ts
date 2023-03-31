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
  Creating,
  Pending,
  ReadyToExecute,
  Executed,
}
