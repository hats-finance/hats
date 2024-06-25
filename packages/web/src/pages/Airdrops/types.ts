export type AirdropDescriptionData = {
  type: "airdrop";
  name: string;
  description: string;
  merkeltree: {
    [address: string]: {
      token_eligibility: {
        committee_member: string;
        depositor: string;
        crow: string;
        coder: string;
        early_contributor: string;
      };
    };
  };
};

export type AirdropData = {
  address: string;
  chainId: number;
  factory: string;
  isLocked: boolean;
  lockEndDate: Date;
  isLive: boolean;
  deadlineDate: Date;
  token: string;
  redeemedBy: string[];
  eligibleFor: string[];
  descriptionData: AirdropDescriptionData;
};
