import * as types from "../constants/action-types";
import { ScreenSize, NotificationType } from "../constants/constants";
import { IVault } from "../types/types";

export const connect = ({ provider }) => ({
  type: types.CONNECT,
  provider
})

export const updateSelectedAddress = (selectedAddress: string) => ({
  type: types.UPDATE_SELECTED_ADDRESS,
  selectedAddress
})

export const updateWalletBalance = (ethBalance: string, hatsBalance: string) => ({
  type: types.UPDATE_WALLET_BALANCE,
  ethBalance,
  hatsBalance
})

export const changeScreenSize = (screenSize: ScreenSize) => ({
  type: types.CHANGE_SCREEN_SIZE,
  screenSize
})

export const toggleMenu = (showMenu: boolean) => ({
  type: types.TOGGLE_MENU,
  showMenu
})

export const toggleNotification = (show: boolean, notificationType: NotificationType | undefined, text: string) => ({
  type: types.TOGGLE_NOTIFICATION,
  show,
  notificationType,
  text
})

export const updateVaults = (vaults: Array<IVault>) => ({
  type: types.UPDATE_VAULTS,
  vaults
})
