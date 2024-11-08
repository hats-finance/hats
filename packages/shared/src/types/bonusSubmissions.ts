export interface IClaimedIssue {
  vaultAddress: string;
  issueNumber: string;
  claimedBy: string;
  claimedAt: Date;
  expiresAt: Date;
}
