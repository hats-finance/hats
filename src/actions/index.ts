import * as types from "../constants/action-types";
import { ScreenSize } from "../constants/constants";
import { IAirdropData, IWithdrawSafetyPeriod } from "../types/types";

export const changeScreenSize = (screenSize: ScreenSize) => ({
  type: types.CHANGE_SCREEN_SIZE,
  screenSize
})

export const toggleMenu = (showMenu: boolean) => ({
  type: types.TOGGLE_MENU,
  showMenu
})

export const updateWithdrawSafetyPeriod = (withdrawSafetyPeriod: IWithdrawSafetyPeriod) => ({
  type: types.UPDATE_WITHDRAW_SAFETY_PERIOD,
  withdrawSafetyPeriod
})

export const updateAirdropData = (airdrop: IAirdropData) => ({
  type: types.UPDATE_AIRDROP_DATA,
  airdrop
})
