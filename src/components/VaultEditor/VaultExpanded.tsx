import { IVault } from "../../types/types";
import { t } from "i18next";
import Members from "./Members";
import Multisig from "../Vault/Multisig";
import { PieChartColors, ScreenSize } from "../../constants/constants";
import { PieChart } from "react-minimal-pie-chart";
import { useState } from "react";
import humanizeDuration from "humanize-duration";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import VaultAction from "./VaultAction";
import { isMobile } from "web3modal";
import ArrowIcon from "../../assets/icons/arrow.icon";
import "./VaultExpanded.scss";

interface IProps {
  data: IVault
}

export default function VaultExpanded(props: IProps) {
  const { hackerVestedRewardSplit, hackerRewardSplit, committeeRewardSplit, swapAndBurnSplit, governanceHatRewardSplit, hackerHatRewardSplit, vestingDuration, stakingTokenSymbol } = props.data.parentVault;
  const { description } = props.data;
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  const pieChartData = [
    { title: `Vested ${stakingTokenSymbol} for ${humanizeDuration(Number(vestingDuration) * 1000, { units: ["d", "h", "m"] })} (Hacker reward)`, value: Number(hackerVestedRewardSplit) / 100, color: PieChartColors.vestedToken },
    { title: `${stakingTokenSymbol} (Hacker reward)`, value: Number(hackerRewardSplit) / 100, color: PieChartColors.token },
    { title: 'Committee', value: Number(committeeRewardSplit) / 100, color: PieChartColors.committee },
    { title: `Vested Hats for ${humanizeDuration(Number(props.data.parentVault.master.vestingHatDuration) * 1000, { units: ["d", "h", "m"] })} (Hacker reward)`, value: Number(hackerHatRewardSplit) / 100, color: PieChartColors.vestedHats },
    { title: 'Governance', value: Number(governanceHatRewardSplit) / 100, color: PieChartColors.governance },
    { title: 'Swap and Burn', value: Number(swapAndBurnSplit) / 100, color: PieChartColors.swapAndBurn },
  ];

  const pieChartNonZeroVaules = pieChartData.filter((obj) => obj.value !== 0);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);

  const nextSegement = () => {
    if (selectedSegmentIndex + 1 === pieChartNonZeroVaules.length) {
      setSelectedSegmentIndex(0);
    } else {
      setSelectedSegmentIndex(selectedSegmentIndex + 1);
    }
  }

  const prevSegement = () => {
    if (selectedSegmentIndex - 1 === -1) {
      setSelectedSegmentIndex(pieChartNonZeroVaules.length - 1);
    } else {
      setSelectedSegmentIndex(selectedSegmentIndex - 1);
    }
  }

  return (
    <tr>
      <td className="sub-row" colSpan={7}>
        <div className="vault-expanded">
          {screenSize === ScreenSize.Mobile && (
            <div >
              <VaultAction />
            </div>
          )}
          <div className="vault-details-wrapper">
            <div className="sub-title">
              {t("VaultEditor.vault-details.title")}
            </div>
            <div className="vault-details-content">
              <div>
                <span className="vault-expanded-subtitle">{t("VaultEditor.committee-members")}:</span>
                <div className="twitter-avatars-wrapper">
                  <Members members={description.committee.members} />
                </div>
                <div className="multi-sig-wrapper">
                  <span className="vault-expanded-subtitle">{t("VaultEditor.review-vault.committee-address")}:</span>
                  <Multisig multisigAddress={description.committee["multisig-address"]} />
                </div>
                <div className="submit-vulnerability-button-wrapper">
                  <button disabled>{t("VaultEditor.review-vault.submit-vulnerability")}</button>
                </div>
              </div>
              <div className="prize-division-wrapper">
                <span className="vault-expanded-subtitle">{t("VaultEditor.review-vault.prize-division")}:</span>
                <div className="pie-chart-wrapper">

                  <div className="pie-chart-container">
                    {isMobile() && <button style={{ transform: "rotate(180deg)" }} onClick={nextSegement}><ArrowIcon width="20" height="20" /></button>}
                    <PieChart
                      onMouseOver={(e, segmentIndex) => {
                        setSelectedSegmentIndex(segmentIndex);
                      }}
                      lineWidth={30}
                      data={pieChartNonZeroVaules} />
                    {isMobile() && <button onClick={prevSegement}><ArrowIcon width="20" height="20" /></button>}
                  </div>

                  <div className="label-wrapper" style={{ borderLeftColor: pieChartNonZeroVaules[selectedSegmentIndex].color }}>
                    <span className="value">{`${pieChartNonZeroVaules[selectedSegmentIndex].value}%`}</span>
                    <span>{pieChartNonZeroVaules[selectedSegmentIndex].title}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr >
  )
}
