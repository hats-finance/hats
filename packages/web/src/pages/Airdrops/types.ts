interface DropDescriptionDataBase {
  type: "airdrop" | "pointdrop";
  name: string;
  description: string;
}

export interface AirdropDescriptionData extends DropDescriptionDataBase {
  type: "airdrop";
  merkletree: {
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
}

export interface PointdropDescriptionData extends DropDescriptionDataBase {
  type: "pointdrop";
  total_tokens: string;
  total_points: string;
  merkletree: {
    [address: string]: {
      converted_points: string;
      token_eligibility: {
        converted_from_points: string;
      };
    };
  };
}

export type DropDescriptionData = AirdropDescriptionData | PointdropDescriptionData;

export type DropData = {
  startTimeDate: Date;
  factory: string;
  address: string;
  chainId: number;
  isLocked: boolean;
  lockEndDate: Date;
  isLive: boolean;
  deadlineDate: Date;
  token: string;
  redeemedBy: string[];
  eligibleFor: string[];
  descriptionData: DropDescriptionData;
};
