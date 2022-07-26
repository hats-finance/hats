import * as types from "../constants/action-types";
import { ScreenSize } from "../constants/constants";
import { IAirdropData } from "../types/types";

export const changeScreenSize = (screenSize: ScreenSize) => ({
  type: types.CHANGE_SCREEN_SIZE,
  screenSize
})

export const toggleMenu = (showMenu: boolean) => ({
  type: types.TOGGLE_MENU,
  showMenu
})

export const updateAirdropData = (airdrop: IAirdropData) => ({
  type: types.UPDATE_AIRDROP_DATA,
  airdrop
})
