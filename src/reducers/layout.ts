import { CHANGE_SCREEN_SIZE, TOGGLE_IN_TRANSACTION, TOGGLE_MENU, TOGGLE_NOTIFICATION, UPDATE_LIQUIDITY_POOL } from '../constants/action-types';
import { getScreenSize } from '../utils';

const initialState = {
  screenSize: getScreenSize(),
  showMenu: false,
  notification: {
    show: false,
    type: undefined,
    text: ""
  },
  inTransaction: false,
  liquidityPoolID: "" 
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
    case TOGGLE_NOTIFICATION:
      return {
        ...state,
        notification: {
          show: action.show,
          type: action.notificationType,
          text: action.text
        }
      }
    case TOGGLE_IN_TRANSACTION:
      return {
        ...state,
        inTransaction: action.inTransaction
      }
    case UPDATE_LIQUIDITY_POOL:
      return {
        ...state,
        liquidityPoolID: action.liquidityPoolID
      }
    default: return state;
  }
};
