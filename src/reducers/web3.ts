
import { Web3Provider } from "@ethersproject/providers";
import { CONNECT, UPDATE_NETWORK, UPDATE_SELECTED_ADDRESS, UPDATE_WALLET_BALANCE } from "../constants/action-types";
import { normalizeAddress } from "../utils";

interface IState {
  provider: Web3Provider | null;
  ethBalance: string | null;
  hatsBalance: string | null;
  selectedAddress: string | null;
  network: string | null;
}

const initialState: IState = {
  provider: null,
  ethBalance: null,
  hatsBalance: null,
  selectedAddress: null,
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
    case UPDATE_SELECTED_ADDRESS: {
      return {
        ...state,
        selectedAddress: normalizeAddress(action.selectedAddress)
      }
    }
    case UPDATE_WALLET_BALANCE: {
      return {
        ...state,
        ethBalance: action.ethBalance,
        hatsBalance: action.hatsBalance
      }
    }
    case UPDATE_NETWORK: {
      return { ...state, network: action.network }
    }
    default:
      return state;
  }
};
