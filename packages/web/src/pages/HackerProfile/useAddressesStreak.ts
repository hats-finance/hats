import { IPayoutGraph } from "@hats-finance/shared";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useCallback, useMemo } from "react";

export const useAddressesStreak = (addresses: string[] = []) => {
  const { allPayoutsOnEnv, allVaults } = useVaults();
  const addressesToUse = useMemo(() => addresses.map((a) => a.toLowerCase()), [addresses]);

  const validPayouts = useMemo(() => {
    if (!allPayoutsOnEnv || !allVaults) return [];
    const payouts = allPayoutsOnEnv.filter((payout) => payout.isApproved && payout.payoutData);
    for (const payout of payouts) {
      payout.vaultData = allVaults.find((vault) => vault.id === payout.vault.id);
    }

    const payoutsWithData = payouts.filter((payout) => !!payout.payoutData);
    return payoutsWithData;
  }, [allPayoutsOnEnv, allVaults]);

  const payoutsGroupedByMonthYear: { [key: string]: IPayoutGraph[] } = useMemo(() => {
    const payoutsByMonth = validPayouts.reduce((acc, curr) => {
      if (!curr.payoutData) return acc;

      const isAudit = curr.vaultData?.description?.["project-metadata"].type === "audit";
      const dateToUse = isAudit
        ? curr.vaultData?.description?.["project-metadata"].starttime
        : curr.approvedAt
        ? +curr.approvedAt
        : 0;

      const payoutDate = new Date((dateToUse ?? 0) * 1000);
      const month = payoutDate.getMonth() + 1;
      const year = payoutDate.getFullYear();
      const key = `${month}-${year}`;

      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);

      return acc;
    }, {} as { [key: string]: any[] });

    return payoutsByMonth;
  }, [validPayouts]);

  // A streak is defined as consecutive months where the hacker has at least one payout.
  // This function uses `addresses` as the addresses of the hacker we want to get the streak.
  // i.e, if a hacker has a payout in January, February, and March (and last payout was in March), the streak count is 3.
  // i.e, if a hacker has a payout in January, and February (and last payout was in March), the streak count is 2.
  // i.e, if a hacker has a payout in January, and February (and last payout was in April), the streak count is 0. (Because in march the user broke the streak)
  const getAddressesStreakCount = useCallback(
    (addrs: string[] = []) => {
      if (!payoutsGroupedByMonthYear) return 0;

      const monthsYear = Object.keys(payoutsGroupedByMonthYear).sort((a, b) => {
        const [aMonth, aYear] = a.split("-").map((n) => +n);
        const [bMonth, bYear] = b.split("-").map((n) => +n);

        if (aYear === bYear) return aMonth - bMonth;
        return aYear - bYear;
      });

      let streakCount = 0;
      for (let i = monthsYear.length - 1; i >= 0; i--) {
        const monthYear = monthsYear[i];
        const payouts = payoutsGroupedByMonthYear[monthYear];
        const isAddressInMonth = payouts.find((payout) => {
          if (!payout.payoutData) return false;

          if (payout.payoutData.type === "single") {
            return addrs.includes(payout.payoutData.beneficiary.toLowerCase() ?? "");
          } else if (payout.payoutData.type === "split") {
            return payout.payoutData.beneficiaries.some((ben) => addrs.includes(ben.beneficiary.toLowerCase()));
          } else {
            return false;
          }
        });

        if (isAddressInMonth) {
          streakCount += 1;
        } else {
          // Current month and year
          const todayMonthYear = `${new Date().getMonth() + 1}-${new Date().getFullYear()}`;

          // If we are taking a look at today's month, we can't cancel the streak because we don't
          // know if the hacker will have a payout later this month. So, continue the loop
          if (monthYear === todayMonthYear) continue;
          else break;
        }
      }

      return streakCount;
    },
    [payoutsGroupedByMonthYear]
  );

  const maxStreak = useMemo(() => {
    if (!validPayouts) return 0;
    let maxStreak = 0;

    const allAddressesToVerify = validPayouts.reduce((acc, curr) => {
      if (!curr.payoutData) return acc;

      if (curr.payoutData.type === "single") {
        acc.push(curr.payoutData.beneficiary.toLowerCase());
      } else if (curr.payoutData.type === "split") {
        acc.push(...curr.payoutData.beneficiaries.map((ben) => ben.beneficiary.toLowerCase()));
      }

      return acc;
    }, [] as string[]);

    for (const address of allAddressesToVerify) {
      const addressStreak = getAddressesStreakCount([address]);
      if (addressStreak > maxStreak) maxStreak = addressStreak;
    }

    return maxStreak;
  }, [validPayouts, getAddressesStreakCount]);

  return { streakCount: getAddressesStreakCount(addressesToUse), maxStreak, getAddressesStreakCount };
};
