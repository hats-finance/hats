import { UPDATE_VAULTS, UPDATE_REWARDS_TOKEN, UPDATE_HATS_PRICE, UPDATE_WITHDRAW_SAFETY_PERIOD, UPDATE_AIRDROP_DATA, UPDATE_TOKEN_PRICES } from '../constants/action-types';
import { IVault, IWithdrawSafetyPeriod, IAirdropData } from '../types/types';

interface IDataReducer {
  vaults?: Array<IVault>
  tokenPrices: { [token: string]: {} | { usd: number } }
  rewardsToken: string
  hatsPrice?: number
  withdrawSafetyPeriod: IWithdrawSafetyPeriod | Object | any
  airdrop: null | IAirdropData
}

const initialState: IDataReducer = {
  rewardsToken: "",
  tokenPrices: {},
  withdrawSafetyPeriod: {},
  airdrop: null,
};

export const dataReducer = (state: IDataReducer = initialState, action: any): IDataReducer => {
  switch (action.type) {
    case UPDATE_VAULTS: {
      return {
        ...state,
        vaults: action.vaults as IVault[]
      }
    }
    case UPDATE_REWARDS_TOKEN: {
      return {
        ...state,
        rewardsToken: action.rewardsToken
      }
    }
    case UPDATE_TOKEN_PRICES: {
      return {
        ...state,
        tokenPrices: action.tokenPrices
      }
    }
    case UPDATE_HATS_PRICE: {
      return {
        ...state,
        hatsPrice: action.hatsPrice
      }
    }
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
