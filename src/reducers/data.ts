import { UPDATE_WITHDRAW_SAFETY_PERIOD, UPDATE_AIRDROP_DATA } from '../constants/action-types';
import { IWithdrawSafetyPeriod, IAirdropData } from '../types/types';

interface IDataReducer {
  rewardsToken: string
  hatsPrice?: number
  withdrawSafetyPeriod: IWithdrawSafetyPeriod | Object | any
  airdrop: null | IAirdropData
}

const initialState: IDataReducer = {
  rewardsToken: "",
  withdrawSafetyPeriod: {},
  airdrop: null,
};

export const dataReducer = (state: IDataReducer = initialState, action: any): IDataReducer => {
  switch (action.type) {
    case UPDATE_WITHDRAW_SAFETY_PERIOD: {
      return {
        ...state,
        withdrawSafetyPeriod: action.withdrawSafetyPeriod
      }
    }
    case UPDATE_AIRDROP_DATA: {
      return {
        ...state,
        airdrop: action.airdrop
      }
    }
    default: return state;
  }
};
