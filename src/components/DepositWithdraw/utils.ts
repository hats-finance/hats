import { MutableRefObject, useEffect, useRef } from "react";
import { BigNumber } from "@ethersproject/bignumber";

export function usePrevious<T>(
  value: T,
): MutableRefObject<T | undefined>['current'] {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/**
 * Calculates the value we send to the contract when a user wants to withdraw
 * @param {BigNumber} amountAvailableToWithdraw
 * @param {string} userInput The actual number the user insterted
 * @param {BigNumber} userShares
 * @param {string} decimals
 */
export const calculateActualWithdrawValue = (
  amountAvailableToWithdraw?: BigNumber,
  userInput?: BigNumber,
  userShares?: BigNumber
) => {
  if (!amountAvailableToWithdraw || !userInput || !userShares) return undefined;
  return userInput.mul(userShares)
    .div(amountAvailableToWithdraw)
    .toString();
};
