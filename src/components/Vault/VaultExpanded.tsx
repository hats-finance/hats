import { IPoolWithdrawRequest, IVault, IVaultDescription } from "../../types/types";
import { parseJSONToObject, setVulnerabilityProject } from "../../utils";
import Members from "./Members";
import Multisig from "./Multisig";
import Severities from "./Severities/Severities";
import { useHistory } from "react-router-dom";
import { PieChartColors, RoutePaths, ScreenSize } from "../../constants/constants";
import { PieChart } from "react-minimal-pie-chart";
import { useState } from "react";
import humanizeDuration from "humanize-duration";
import "./VaultExpanded.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import VaultAction from "./VaultAction";

interface IProps {
  data: IVault
  withdrawRequests: IPoolWithdrawRequest[]
  setShowModal: Function
  setModalData: Function
}

export default function VaultExpanded(props: IProps) {
  const { id, hackerVestedRewardSplit, hackerRewardSplit, committeeRewardSplit, swapAndBurnSplit, governanceHatRewardSplit, hackerHatRewardSplit, vestingDuration, stakingTokenSymbol } = props.data.parentVault;
  const { name, isGuest, parentDescription } = props.data;
  const history = useHistory();
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  const description: IVaultDescription = parseJSONToObject(props.data?.description as string);
  const descriptionParent: IVaultDescription = parentDescription && parseJSONToObject(parentDescription as string);

  const pieChartData = [
    { title: `Vested ${stakingTokenSymbol} for ${humanizeDuration(Number(vestingDuration) * 1000, { units: ["d", "h", "m"] })} (Hacker reward)`, value: Number(hackerVestedRewardSplit) / 100, color: PieChartColors.vestedToken },
    { title: `${stakingTokenSymbol} (Hacker reward)`, value: Number(hackerRewardSplit) / 100, color: PieChartColors.token },
    { title: 'Committee', value: Number(committeeRewardSplit) / 100, color: PieChartColors.committee },
    { title: `Vested Hats for ${humanizeDuration(Number(props.data.parentVault.master.vestingHatDuration) * 1000, { units: ["d", "h", "m"] })} (Hacker reward)`, value: Number(hackerHatRewardSplit) / 100, color: PieChartColors.vestedHats },
    { title: 'Governance', value: Number(governanceHatRewardSplit) / 100, color: PieChartColors.governance },
    { title: 'Swap and Burn', value: Number(swapAndBurnSplit) / 100, color: PieChartColors.swapAndBurn },
  ];

  const [currentPieData, setCurrentPieData] = useState({
    vaule: pieChartData[0].value,
    title: pieChartData[0].title,
    color: PieChartColors.vestedToken
  });

  return (
    <tr>
      <td className="sub-row" colSpan={7}>
        <div className="vault-expanded">
          {screenSize === ScreenSize.Mobile && (
            <div >
              <VaultAction data={props.data}
                withdrawRequests={props.withdrawRequests}
                setShowModal={props.setShowModal}
                setModalData={props.setModalData} />
            </div>
          )}
          <div className="vault-details-wrapper">
            <div className="sub-title">
              VAULT DETAILS
            </div>
            <div className="vault-details-content">
              <div>
                <span className="vault-expanded-subtitle">Committee Members:</span>
                <div className="twitter-avatars-wrapper">
                  <Members members={isGuest ? descriptionParent?.committee?.members : description?.committee?.members} />
                </div>
                <div className="multi-sig-wrapper">
                  <span className="vault-expanded-subtitle">Committee Address:</span>
                  <Multisig multisigAddress={isGuest ? descriptionParent?.committee?.["multisig-address"] : description?.committee?.["multisig-address"]} />
                </div>
                <div className="submit-vulnerability-button-wrapper">
                  <button onClick={() => { setVulnerabilityProject(name, id); history.push(RoutePaths.vulnerability); }}>SUBMIT VULNERABILITY</button>
                </div>
              </div>
              <div className="prize-division-wrapper">
                <span className="vault-expanded-subtitle">Prize Content Division:</span>
                <div className="pie-chart-wrapper">
                  <PieChart
                    onMouseOver={(e, segmentIndex) => {
                      setCurrentPieData({ vaule: pieChartData[segmentIndex].value, title: pieChartData[segmentIndex].title, color: pieChartData[segmentIndex].color });
                    }}
                    lineWidth={30}
                    data={pieChartData} />
                  <div className="label-wrapper" style={{ borderLeftColor: currentPieData.color }}>
                    <span className="value">{`${currentPieData.vaule}%`}</span>
                    <span>{currentPieData.title}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="severity-prizes-wrapper">
            <div className="sub-title">SEVERITY PRIZES</div>
            <div className="severity-prizes-content">
              <Severities
                severities={description?.severities}
                parentVault={props.data.parentVault} />
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}
