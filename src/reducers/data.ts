import { UPDATE_AIRDROP_DATA } from '../constants/action-types';
import { IAirdropData } from '../types/types';

interface IDataReducer {
  rewardsToken: string
  hatsPrice?: number
  airdrop: null | IAirdropData
}

const initialState: IDataReducer = {
  rewardsToken: "",
  airdrop: null,
};

export const dataReducer = (state: IDataReducer = initialState, action: any): IDataReducer => {
  switch (action.type) {
    case UPDATE_AIRDROP_DATA: {
      return {
        ...state,
        airdrop: action.airdrop
      }
    }
    default: return state;
  }
};
