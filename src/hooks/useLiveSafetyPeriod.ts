import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { IWithdrawSafetyPeriod } from "types/types";



export function useLiveSafetyPeriod(safetyPeriod, withdrawPeriod): IWithdrawSafetyPeriod | undefined {
    const [withdrawSafetyPeriod, setWithdrawSafetyPeriod] = useState<IWithdrawSafetyPeriod | undefined>();
    const updateWithdrawSafetyPeriodState = useCallback((
    ) => {
        const currentTimestamp = Date.now();
        const sum = (Number(withdrawPeriod) + Number(safetyPeriod)) * 1000;


        const safetyEndsAt = sum * Math.floor(currentTimestamp / sum) + sum;
        const safetyStartsAt = sum * Math.floor(currentTimestamp / sum) + Number(withdrawPeriod) * 1000;
        const isSafetyPeriod =
            currentTimestamp >= safetyStartsAt;
        setWithdrawSafetyPeriod({ safetyEndsAt, safetyStartsAt, isSafetyPeriod });
    }, [safetyPeriod, withdrawPeriod]);


    useEffect(() => {
        if (withdrawPeriod && safetyPeriod) {
            updateWithdrawSafetyPeriodState();
        }
    }, [withdrawPeriod, safetyPeriod, updateWithdrawSafetyPeriodState]);


    useEffect(() => {
        if (!withdrawSafetyPeriod) return;
        if (withdrawSafetyPeriod.isSafetyPeriod && withdrawSafetyPeriod.safetyEndsAt) {
            const interval = setInterval(() => {
                updateWithdrawSafetyPeriodState();
            }, withdrawSafetyPeriod.safetyEndsAt - Date.now());
            return () => clearInterval(interval);
        } else {
            const interval = setInterval(() => {
                updateWithdrawSafetyPeriodState();
            }, withdrawSafetyPeriod.safetyStartsAt - Date.now());
            return () => clearInterval(interval);
        }

    }, [withdrawSafetyPeriod, updateWithdrawSafetyPeriodState]);

    return withdrawSafetyPeriod;
}