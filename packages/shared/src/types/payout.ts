export interface IPayoutResponse {
  _id: string;
  vaultAddress: string;
  chainId: number;
  payoutData: IPayoutData;
  nonce: number;
  txToSign: string;
  signatures: IPayoutSignature[];
  status: PayoutStatus;
  lastActionNeededNotifiedAt: Date;
  payoutTxHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPayoutData {
  title: string;
  reportTxid: string;
  reportDate: Date;
  encryptedMessage: string;
  decryptedMessage: string;
  percentageToPay: number;
  beneficiary: string;
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
