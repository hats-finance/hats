import { CHANGE_SCREEN_SIZE, TOGGLE_IN_TRANSACTION, TOGGLE_MENU, TOGGLE_PENDING_WALLET, TOGGLE_SUBMITTING_VULNERABILITY, UPDATE_TRANSACTION_HASH } from '../constants/action-types';
import { getScreenSize } from '../utils';

const initialState = {
  screenSize: getScreenSize(),
  showMenu: false,
  inTransaction: false,
  pendingWallet: false,
  transactionHash: "",
  submittingVulnerability: false
};

export const layoutReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CHANGE_SCREEN_SIZE: {
      return {
        ...state,
        screenSize: action.screenSize
      }
    }
    case TOGGLE_MENU:
      return {
        ...state,
        showMenu: action.showMenu
      }
    case TOGGLE_IN_TRANSACTION:
      return {
        ...state,
        inTransaction: action.inTransaction,
      }
    case TOGGLE_PENDING_WALLET:
      return {
        ...state,
        pendingWallet: action.pendingWallet
      }
    case UPDATE_TRANSACTION_HASH:
      return {
        ...state,
        transactionHash: action.transactionHash
      }
    case TOGGLE_SUBMITTING_VULNERABILITY:
      return {
        ...state,
        submittingVulnerability: action.submittingVulnerability
      }
    default: return state;
  }
};
