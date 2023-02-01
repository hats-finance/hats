import * as types from "../constants/action-types";
import { ScreenSize } from "../constants/constants";

export const changeScreenSize = (screenSize: ScreenSize) => ({
  type: types.CHANGE_SCREEN_SIZE,
  screenSize
});

export const toggleMenu = (showMenu: boolean) => ({
  type: types.TOGGLE_MENU,
  showMenu
});
