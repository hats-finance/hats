import { AirdropFactoriesChainConfig } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import moment from "moment";
import { useAirdropsByFactories } from "pages/Airdrops/hooks";
import { PointdropDescriptionData } from "pages/Airdrops/types";
import { useMemo } from "react";
import { IS_PROD } from "settings";
import { Amount } from "utils/amounts.utils";
import { useNetwork } from "wagmi";

export const usePointValue = () => {
  const { chain: connectedChain } = useNetwork();

  const isTestnet = !IS_PROD && connectedChain?.testnet;
  const env = isTestnet ? "test" : "prod";
  const { data: pointdropsData } = useAirdropsByFactories(AirdropFactoriesChainConfig[env].pointdrop);
  pointdropsData?.sort((a, b) => b.startTimeDate.getTime() - a.startTimeDate.getTime());

  // Point value splitter by month and year. i.e. { "2021-01": 0.1, "2021-02": 0.2, ... }
  const pointValuePerMonthYear: { [date: string]: number } = useMemo(() => {
    if (!pointdropsData) return {};

    // Get points values per month
    // (we can have more than one value per month if there are more than one pointdrop in the same month)
    const pointValues = pointdropsData.reduce((acc, pointdrop) => {
      const descriptionData = pointdrop.descriptionData as PointdropDescriptionData;
      const date = moment(pointdrop.startTimeDate).format("YYYY-MM");

      const totalPoints = Number(descriptionData.total_points ?? "0");
      const totalTokens = new Amount(BigNumber.from(descriptionData.total_tokens ?? "0"), 18).number;

      const pointValue = totalPoints > 0 ? totalTokens / totalPoints : 0;
      return { ...acc, [date]: [...(acc[date] ?? []), pointValue] };
    }, {} as { [date: string]: number[] });

    // Calculate the average point value per month
    return Object.entries(pointValues).reduce((acc, [date, values]) => {
      const averagePointValue = values.reduce((acc, value) => acc + value, 0) / values.length;
      return { ...acc, [date]: averagePointValue };
    }, {} as { [date: string]: number });
  }, [pointdropsData]);

  return pointValuePerMonthYear;
};
