import { UPDATE_AIRDROP_DATA } from "../constants/action-types";

interface IDataReducer {
  rewardsToken: string;
  hatsPrice?: number;
}

const initialState: IDataReducer = {
  rewardsToken: ""
};

export const dataReducer = (state: IDataReducer = initialState, action: any): IDataReducer => {
  switch (action.type) {
    default:
      return state;
  }
};
