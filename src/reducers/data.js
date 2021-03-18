import { UPDATE_VAULTS } from '../constants/action-types';

const initialState = {
  vaults: []
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VAULTS: {
      return {
        ...state,
        vaults: action.vaults
      }
    }
    default: return state;
  }
};
