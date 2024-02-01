import { IVault } from "@hats.finance/shared";
import { BigNumber, ethers } from "ethers";
import humanizeDuration from "humanize-duration";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PieChart } from "react-minimal-pie-chart";
import { StyledDivisionInformation } from "./styles";

enum PieChartColors {
  token = "#24E8C5",
  vestedToken = "#1EC3A5",
  committee = "#189D85",
  vestedHats = "#127865",
  governance = "#0C5245",
  swapAndBurn = "#0C5245",
}

type VaultRewardDivisionProps = {
  vault: IVault;
};

export const VaultRewardDivision = ({ vault }: VaultRewardDivisionProps) => {
  const { t } = useTranslation();

  const [showedDivision, setShowedDivision] = useState(0);

  const pieChartData = useMemo(() => {
    const bountyVestingDuration = humanizeDuration(Number(vault.vestingDuration) * 1000, {
      units: ["d", "h", "m"],
    });
    const rewardVestingDuration = humanizeDuration(Number(vault.master.vestingHatDuration) * 1000, {
      units: ["d", "h", "m"],
    });

    const governanceSplit = BigNumber.from(vault.governanceHatRewardSplit).eq(ethers.constants.MaxUint256)
      ? vault.master.defaultGovernanceHatRewardSplit
      : vault.governanceHatRewardSplit;
    const hackerHatsSplit = BigNumber.from(vault.hackerHatRewardSplit).eq(ethers.constants.MaxUint256)
      ? vault.master.defaultHackerHatRewardSplit
      : vault.hackerHatRewardSplit;

    // In v2 vaults the split sum (immediate, vested, committee) is 100%. So we need to calculate the split factor to get the correct values.
    // In v1 this is not a probem. So the factor is 1.
    const splitFactor = vault.version === "v1" ? 1 : (10000 - Number(governanceSplit) - Number(hackerHatsSplit)) / 100 / 100;

    const chartData = [
      {
        // Immediate bounty
        title: t("immediateBountyInTokens", { token: vault.stakingTokenSymbol }),
        value: +((Number(vault.hackerRewardSplit) / 100) * splitFactor).toFixed(2),
        color: PieChartColors.token,
      },
      {
        // Vested bounty
        title: t("vestedBountyForDurationInTokens", { duration: bountyVestingDuration, token: vault.stakingTokenSymbol }),
        value: +((Number(vault.hackerVestedRewardSplit) / 100) * splitFactor).toFixed(2),
        color: PieChartColors.vestedToken,
      },
      {
        // Committee fee
        title: t("committeeFee"),
        value: +((Number(vault.committeeRewardSplit) / 100) * splitFactor).toFixed(2),
        color: PieChartColors.committee,
      },
      {
        title: t("vestedHatsForDuration", { duration: rewardVestingDuration }),
        value: +(Number(hackerHatsSplit) / 100).toFixed(2),
        color: PieChartColors.vestedHats,
      },
      {
        title: t("hatsGovFee"),
        value: +(Number(governanceSplit) / 100).toFixed(2),
        color: PieChartColors.governance,
      },
      // {
      //   title: `Swap and burn`,
      //   value: Number(swapAndBurnSplit) / 100,
      //   color: PieChartColors.swapAndBurn,
      // },
    ];

    return chartData.filter((data) => data.value > 0);
  }, [vault, t]);

  return (
    <div>
      <PieChart
        segmentsStyle={(idx) => (idx === showedDivision ? { strokeWidth: "24" } : { strokeWidth: "14" })}
        segmentsShift={(idx) => (idx === showedDivision ? 5 : 0)}
        onMouseOver={(_, idx) => setShowedDivision(idx)}
        radius={66}
        data={pieChartData}
      />

      <StyledDivisionInformation color={pieChartData[showedDivision].color}>
        <h4>{pieChartData[showedDivision].value}%</h4>
        <p>{pieChartData[showedDivision].title}</p>
      </StyledDivisionInformation>
    </div>
  );
};
