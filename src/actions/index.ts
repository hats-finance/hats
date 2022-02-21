import * as types from "../constants/action-types";
import { ScreenSize, NotificationType } from "../constants/constants";
import { IAirdropData, IVault, IWithdrawSafetyPeriod } from "../types/types";

export const connect = ({ provider }: any) => ({
  type: types.CONNECT,
  provider
})

export const updateSelectedAddress = (selectedAddress: string) => ({
  type: types.UPDATE_SELECTED_ADDRESS,
  selectedAddress
})

export const updateWalletBalance = (ethBalance: any, hatsBalance: any) => ({
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

export const toggleNotification = (show: boolean, notificationType: NotificationType | undefined, text: string, disableAutoHide?: boolean) => ({
  type: types.TOGGLE_NOTIFICATION,
  show,
  notificationType,
  text,
  disableAutoHide
})

export const updateVaults = (vaults: Array<IVault>) => ({
  type: types.UPDATE_VAULTS,
  vaults
})

export const updateRewardsToken = (rewardsToken: string) => ({
  type: types.UPDATE_REWARDS_TOKEN,
  rewardsToken
})

export const toggleInTransaction = (inTransaction: boolean) => ({
  type: types.TOGGLE_IN_TRANSACTION,
  inTransaction
})

export const updateTransactionHash = (transactionHash: string) => ({
  type: types.UPDATE_TRANSACTION_HASH,
  transactionHash
})

export const updateHatsPrice = (hatsPrice: number) => ({
  type: types.UPDATE_HATS_PRICE,
  hatsPrice
})

export const updateWithdrawSafetyPeriod = (withdrawSafetyPeriod: IWithdrawSafetyPeriod) => ({
  type: types.UPDATE_WITHDRAW_SAFETY_PERIOD,
  withdrawSafetyPeriod
})

export const toggleSubmittingVulnerability = (submittingVulnerability: boolean) => ({
  type: types.TOGGLE_SUBMITTING_VULNERABILITY,
  submittingVulnerability
})

export const updateAirdropData = (airdrop: IAirdropData) => ({
  type: types.UPDATE_AIRDROP_DATA,
  airdrop
})
