import { CHANGE_SCREEN_SIZE, TOGGLE_MENU } from '../constants/action-types';
import { getScreenSize } from '../utils';

const initialState = {
  screenSize: getScreenSize(),
  showMenu: false
};

export const layoutReducer = (state = initialState, action) => {
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
    default: return state;
  }
};
