
import { Web3Provider } from "@ethersproject/providers";
import { CONNECT, UPDATE_WALLET_BALANCE } from "../constants/action-types";

interface IState {
  provider: Web3Provider | null;
  network: string | null;
}

const initialState: IState = {
  provider: null,
  network: null
};

export const web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT: {
      return {
        ...state,
        provider: action.provider
      }
    }
    case UPDATE_WALLET_BALANCE: {
      return {
        ...state,
        ethBalance: action.ethBalance,
        hatsBalance: action.hatsBalance
      }
    }
    default:
      return state;
  }
};
