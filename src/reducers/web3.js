import { CONNECT, UPDATE_SELECTED_ADDRESS } from "../constants/action-types";

const initialState = {
  provider: null
};

export const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT: {
      return {
        ...state,
        provider: action.provider
      }
    }
    case UPDATE_SELECTED_ADDRESS: {
      return {
        ...state,
        provider: {
          ...state.provider,
          selectedAddress: action.selectedAddress
        }
      }
    }
    default:
        return state;
  }
};
