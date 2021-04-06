import { UPDATE_VAULTS, UPDATE_REWARDS_TOKEN } from '../constants/action-types';

const initialState = {
  vaults: [],
  rewardsToken: ""
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VAULTS: {
      return {
        ...state,
        vaults: action.vaults
      }
    }
    case UPDATE_REWARDS_TOKEN: {
      return {
        ...state,
        rewardsToken: action.rewardsToken
      }
    }
    default: return state;
  }
};
