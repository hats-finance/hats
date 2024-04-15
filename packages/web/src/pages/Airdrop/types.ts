export type AirdropMerkeltree = {
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
