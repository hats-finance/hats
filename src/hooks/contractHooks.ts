import { Contract } from "@ethersproject/contracts";
import { TransactionOptions, useCall, useContractFunction } from "@usedapp/core";
import { ContractFunctionNames, TypedContract } from "@usedapp/core/dist/esm/src/model/types";
import { toggleInTransaction, togglePendingWallet, updateTransactionHash } from "actions";
import { BigNumber } from "ethers";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { NFT_AIRDROP_ADDRESS, TOKEN_AIRDROP_ADDRESS } from "settings";
import { checkMasterAddress } from "utils";
import erc20Abi from "../data/abis/erc20.json";
import vaultAbi from "../data/abis/HATSVault.json";
import NFTAirdrop from "../data/abis/NFTAirdrop.json";
import TokenAirdrop from "../data/abis/TokenAirdrop.json";
import useNotification from "./useNotification";
import { NotificationType } from "components/Notifications/NotificationProvider";


export function usePendingReward(
  address: string,
  pid: string,
  account: string
): BigNumber | undefined {
  const { value, error } =
    useCall({
      contract: new Contract(address, vaultAbi),
      method: "pendingReward",
      args: [pid, account]
    }) ?? {};
  if (error) {
    return undefined;
  }
  return value?.[0];
}

export function useTokenApprove(tokenAddress: string) {
  return useContract(new Contract(tokenAddress, erc20Abi), "approve");
}

export function useDepositAndClaim(address: string) {
  checkMasterAddress(address);
  return useContract(new Contract(address, vaultAbi), "deposit");
}

export function useWithdrawAndClaim(address: string) {
  checkMasterAddress(address);
  return useContract(new Contract(address, vaultAbi), "withdraw");
}

export function useWithdrawRequest(address: string) {
  checkMasterAddress(address);
  return useContract(
    new Contract(address, vaultAbi),
    "withdrawRequest"
  );
}

export function useClaim(address: string) {
  checkMasterAddress(address);
  return useContract(new Contract(address, vaultAbi), "claim");
}

export function useClaimReward(address: string) {
  checkMasterAddress(address);
  return useContract(new Contract(address, vaultAbi), "claimReward");
}

export function useCheckIn(address: string) {
  checkMasterAddress(address);
  return useContract(new Contract(address, vaultAbi), "checkIn");
}

export function useRedeemNFT() {
  return useContract(new Contract(NFT_AIRDROP_ADDRESS, NFTAirdrop), "redeem");
}

export function useDelegateAndClaim() {
  return useContract(new Contract(TOKEN_AIRDROP_ADDRESS, TokenAirdrop), "delegateAndClaim");
}

export function useContract<T extends TypedContract, FN extends ContractFunctionNames<T>>(
  contract: T,
  functionName: FN,
  options?: TransactionOptions
) {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const { send: originalSend, state, events, resetState } = useContractFunction(contract, functionName, options);
  useEffect(() => {
    console.log("state", state)
    switch (state.status) {
      case 'None':
        // dispatch(togglePendingWallet(false));
        // dispatch(toggleInTransaction(false));
        break;
      case 'PendingSignature':
        dispatch(togglePendingWallet(true));
        break;
      case 'Mining':
        dispatch(togglePendingWallet(false));
        dispatch(toggleInTransaction(true));
        dispatch(updateTransactionHash(state.transaction?.hash!));
        break;
      case 'Fail':
        dispatch(toggleInTransaction(false));
        dispatch(togglePendingWallet(false));
        //notify("Transaction Failed", NotificationType.Error);
        break;
      case 'Success':
        dispatch(toggleInTransaction(false));
        dispatch(togglePendingWallet(false));
        //notify("Transaction Succeed", NotificationType.Success);
        break;
    }
  }, [state, dispatch]);
  return {
    send: async (...args: Parameters<T['functions'][FN]>) => {
      return await originalSend(...args)
    }, state, events, resetState
  }
}