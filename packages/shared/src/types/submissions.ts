export type ISubmissionMessageObject = {
  ref?: string;
  isEncryptedByHats?: boolean;
  decrypted: string | undefined;
  encrypted: string;
};
