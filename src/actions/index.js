import * as types from '../constants/action-types';

export const connect = ({ provider }) => ({
  type: types.CONNECT,
  provider
})

export const updateSelectedAddress = selectedAddress => ({
  type: types.UPDATE_SELECTED_ADDRESS,
  selectedAddress
})

export const updateWalletBalance = balance => ({
  type: types.UPDATE_WALLET_BALANCE,
  balance
})

export const changeScreenSize = screenSize => ({
  type: types.CHANGE_SCREEN_SIZE,
  screenSize
})

export const toggleMenu = showMenu => ({
  type: types.TOGGLE_MENU,
  showMenu
})
