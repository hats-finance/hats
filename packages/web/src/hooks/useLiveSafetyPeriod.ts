import { useCallback, useEffect, useState } from "react";
import { IWithdrawSafetyPeriod } from "@hats-finance/shared";

/**
 * Computes the safety period of a registry
 * @param withdrawPeriod - Duration of the withdraw period in seconds
 * @param safetyPeriod - Duration of the safety period in seconds
 *
 * A safety period is a period of time where the user can't withdraw his funds.
 * It starts after the withdraw period ends and ends after the safety period ends.
 *
 * Example:
 * Withdraw -> Safety -> Withdraw -> Safety -> ...... -> Withdraw -> Safety
 *
 * @returns {
 *   isSafetyPeriod: boolean - If the current time is in the safety period
 *   ongoingSafetyEndsAt: number - Timestamp of when the ongoing safety period ends
 *   nextSafetyStartsAt: number - Timestamp of when the next safety period starts
 * }
 */
export function useLiveSafetyPeriod(safetyPeriod: string, withdrawPeriod: string): IWithdrawSafetyPeriod | undefined {
  const [withdrawSafetyPeriod, setWithdrawSafetyPeriod] = useState<IWithdrawSafetyPeriod | undefined>();

  const updateWithdrawSafetyPeriodState = useCallback(() => {
    const currentTimestamp = Date.now() / 1000;
    const periodSum = Number(withdrawPeriod) + Number(safetyPeriod);
    const secondsInPeriod = currentTimestamp % periodSum;

    let isSafetyPeriod: boolean;
    let ongoingSafetyEndsAt: number;
    let nextSafetyStartsAt: number;

    // If the seconds in the period are greater than the withdraw period, then we are in the safety period
    if (secondsInPeriod >= Number(withdrawPeriod)) {
      const secondsLeftOnSafetyPeriod = periodSum - secondsInPeriod;

      isSafetyPeriod = true;
      ongoingSafetyEndsAt = (currentTimestamp + secondsLeftOnSafetyPeriod) * 1000;
      nextSafetyStartsAt = 0;
    } else {
      const secondsLeftOnWithdrawPeriod = Number(withdrawPeriod) - secondsInPeriod;

      isSafetyPeriod = false;
      ongoingSafetyEndsAt = 0;
      nextSafetyStartsAt = (currentTimestamp + secondsLeftOnWithdrawPeriod) * 1000;
    }

    setWithdrawSafetyPeriod({ isSafetyPeriod, ongoingSafetyEndsAt, nextSafetyStartsAt });
  }, [safetyPeriod, withdrawPeriod]);

  useEffect(() => {
    if (withdrawPeriod && safetyPeriod) updateWithdrawSafetyPeriodState();
  }, [withdrawPeriod, safetyPeriod, updateWithdrawSafetyPeriodState]);

  useEffect(() => {
    if (!withdrawSafetyPeriod) return;

    if (withdrawSafetyPeriod.isSafetyPeriod && withdrawSafetyPeriod.ongoingSafetyEndsAt) {
      const intervalPeriod = withdrawSafetyPeriod.ongoingSafetyEndsAt - Date.now();
      const interval = setInterval(() => updateWithdrawSafetyPeriodState(), intervalPeriod);
      return () => clearInterval(interval);
    }

    if (!withdrawSafetyPeriod.isSafetyPeriod && withdrawSafetyPeriod.nextSafetyStartsAt) {
      const intervalPeriod = withdrawSafetyPeriod.nextSafetyStartsAt - Date.now();
      const interval = setInterval(() => updateWithdrawSafetyPeriodState(), intervalPeriod);
      return () => clearInterval(interval);
    }
  }, [withdrawSafetyPeriod, updateWithdrawSafetyPeriodState]);

  return withdrawSafetyPeriod;
}
