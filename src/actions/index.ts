import * as types from "../constants/action-types";
import { ScreenSize } from "../constants/constants";
import { IAirdropData, IVault, IWithdrawSafetyPeriod } from "../types/types";

export const connect = (provider: any) => ({
  type: types.CONNECT,
  provider
})

export const changeScreenSize = (screenSize: ScreenSize) => ({
  type: types.CHANGE_SCREEN_SIZE,
  screenSize
})

export const toggleMenu = (showMenu: boolean) => ({
  type: types.TOGGLE_MENU,
  showMenu
})

export const updateVaults = (vaults: Array<IVault>) => ({
  type: types.UPDATE_VAULTS,
  vaults
})

export const updateRewardsToken = (rewardsToken: string) => ({
  type: types.UPDATE_REWARDS_TOKEN,
  rewardsToken
})

export const updateTokenPrices = (tokenPrices: { [token: string]: number }) => ({
  type: types.UPDATE_TOKEN_PRICES,
  tokenPrices
})

export const updateHatsPrice = (hatsPrice: number) => ({
  type: types.UPDATE_HATS_PRICE,
  hatsPrice
})

export const updateWithdrawSafetyPeriod = (withdrawSafetyPeriod: IWithdrawSafetyPeriod) => ({
  type: types.UPDATE_WITHDRAW_SAFETY_PERIOD,
  withdrawSafetyPeriod
})

export const updateAirdropData = (airdrop: IAirdropData) => ({
  type: types.UPDATE_AIRDROP_DATA,
  airdrop
})
