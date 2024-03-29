import ArrowIcon from "assets/icons/arrow.icon";
import { ScreenSize } from "constants/constants";
import { BigNumber, ethers } from "ethers";
import humanizeDuration from "humanize-duration";
import { RoutePaths } from "navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PieChart } from "react-minimal-pie-chart";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "reducers";
import { IPoolWithdrawRequest, IVault, IVaultDescription } from "types";
import { isMobile } from "web3modal";
import VaultActions from "../VaultActions/VaultActions";
import Members from "./Members/Members";
import Multisig from "./Multisig/Multisig";
import Severities from "./Severities/Severities";

// import "./VaultExpanded.scss";

interface IProps {
  data: IVault;
  withdrawRequests?: IPoolWithdrawRequest[];
  preview?: boolean;
  noActions?: boolean;
}

export default function VaultExpanded(props: IProps) {
  return null;
  // const { t } = useTranslation();
  // const {
  //   id,
  //   hackerVestedRewardSplit,
  //   hackerRewardSplit,
  //   committeeRewardSplit,
  //   // swapAndBurnSplit,
  //   governanceHatRewardSplit,
  //   hackerHatRewardSplit,
  //   vestingDuration,
  //   stakingTokenSymbol,
  //   description,
  //   master,
  //   version,
  //   committee,
  // } = props.data;

  // const navigate = useNavigate();
  // const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  // const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);
  // const [chartMouseOver, setChartMouseOver] = useState(false);

  // if (!description) return null;
  // const isNormalVault = !description?.["project-metadata"].type || description?.["project-metadata"].type === "normal";

  // const getPieChartData = () => {
  //   const bountyVestingDuration = humanizeDuration(Number(vestingDuration) * 1000, {
  //     units: ["d", "h", "m"],
  //   });
  //   const rewardVestingDuration = humanizeDuration(Number(props.data.master.vestingHatDuration) * 1000, {
  //     units: ["d", "h", "m"],
  //   });

  //   const governanceSplit = BigNumber.from(governanceHatRewardSplit).eq(ethers.constants.MaxUint256)
  //     ? master.defaultGovernanceHatRewardSplit
  //     : governanceHatRewardSplit;
  //   const hackerHatsSplit = BigNumber.from(hackerHatRewardSplit).eq(ethers.constants.MaxUint256)
  //     ? master.defaultHackerHatRewardSplit
  //     : hackerHatRewardSplit;

  //   // In v2 vaults the split sum (immediate, vested, committee) is 100%. So we need to calculate the split factor to get the correct values.
  //   // In v1 this is not a probem. So the factor is 1.
  //   const splitFactor = version === "v1" ? 1 : (10000 - Number(governanceSplit) - Number(hackerHatsSplit)) / 100 / 100;

  //   return [
  //     {
  //       // Immediate bounty
  //       title: t("immediateBountyInTokens", { token: stakingTokenSymbol }),
  //       value: +((Number(hackerRewardSplit) / 100) * splitFactor).toFixed(2),
  //       color: PieChartColors.token,
  //     },
  //     {
  //       // Vested bounty
  //       title: t("vestedBountyForDurationInTokens", { duration: bountyVestingDuration, token: stakingTokenSymbol }),
  //       value: +((Number(hackerVestedRewardSplit) / 100) * splitFactor).toFixed(2),
  //       color: PieChartColors.vestedToken,
  //     },
  //     {
  //       // Committee fee
  //       title: t("committeeFee"),
  //       value: +((Number(committeeRewardSplit) / 100) * splitFactor).toFixed(2),
  //       color: PieChartColors.committee,
  //     },
  //     {
  //       title: t("vestedHatsForDuration", { duration: rewardVestingDuration }),
  //       value: +(Number(hackerHatsSplit) / 100).toFixed(2),
  //       color: PieChartColors.vestedHats,
  //     },
  //     {
  //       title: t("hatsGovFee"),
  //       value: +(Number(governanceSplit) / 100).toFixed(2),
  //       color: PieChartColors.governance,
  //     },
  //     // {
  //     //   title: `Swap and burn`,
  //     //   value: Number(swapAndBurnSplit) / 100,
  //     //   color: PieChartColors.swapAndBurn,
  //     // },
  //   ];
  // };

  // const pieChartNonZeroVaules = getPieChartData().filter((obj) => obj.value !== 0);

  // const nextSegement = () => {
  //   if (selectedSegmentIndex + 1 === pieChartNonZeroVaules.length) {
  //     setSelectedSegmentIndex(0);
  //   } else {
  //     setSelectedSegmentIndex(selectedSegmentIndex + 1);
  //   }
  // };

  // const prevSegement = () => {
  //   if (selectedSegmentIndex - 1 === -1) {
  //     setSelectedSegmentIndex(pieChartNonZeroVaules.length - 1);
  //   } else {
  //     setSelectedSegmentIndex(selectedSegmentIndex - 1);
  //   }
  // };

  // return (
  //   <tr>
  //     <td className="sub-row" colSpan={7}>
  //       <div className="vault-expanded">
  //         {screenSize === ScreenSize.Mobile && <div>{!props.noActions && <VaultActions {...props} />}</div>}
  //         <div className="vault-details-wrapper">
  //           <div className="sub-title">{t("Vault.vault-details")}</div>
  //           <div className="vault-details-content">
  //             <div>
  //               <span className="vault-expanded-subtitle">{t("Vault.committee-members")}:</span>
  //               <div className="twitter-avatars-wrapper">
  //                 <Members members={description!.committee.members} preview={props.preview} />
  //               </div>
  //               <div className="multi-sig-wrapper">
  //                 <span className="vault-expanded-subtitle">{t("Vault.committee-address")}:</span>
  //                 <Multisig multisigAddress={committee} />
  //               </div>
  //               {!props.noActions && (
  //                 <div className="submit-vulnerability-button-wrapper">
  //                   <button
  //                     onClick={() => {
  //                       navigate(`${RoutePaths.vulnerability}?projectId=${id}`);
  //                     }}
  //                     disabled={props.preview}
  //                   >
  //                     {t("Vault.submit-vulnerability")}
  //                   </button>
  //                 </div>
  //               )}
  //             </div>
  //             <div className="prize-division-wrapper">
  //               <span className="vault-expanded-subtitle">{t("Vault.prize-division")}:</span>
  //               <div className="pie-chart-wrapper">
  //                 <div className="pie-chart-container">
  //                   {isMobile() && (
  //                     <button style={{ transform: "rotate(180deg)" }} onClick={nextSegement}>
  //                       <ArrowIcon width="20" height="20" />
  //                     </button>
  //                   )}
  //                   <PieChart
  //                     onMouseOver={(e, segmentIndex) => {
  //                       setChartMouseOver(true);
  //                       setSelectedSegmentIndex(segmentIndex);
  //                     }}
  //                     onMouseOut={() => setChartMouseOver(false)}
  //                     segmentsShift={(index) =>
  //                       index === selectedSegmentIndex && (chartMouseOver || screenSize === ScreenSize.Mobile) ? 7 : 0
  //                     }
  //                     lineWidth={45}
  //                     data={pieChartNonZeroVaules}
  //                   />
  //                   {isMobile() && (
  //                     <button onClick={prevSegement}>
  //                       <ArrowIcon width="20" height="20" />
  //                     </button>
  //                   )}
  //                 </div>

  //                 <div className="label-wrapper" style={{ borderLeftColor: pieChartNonZeroVaules[selectedSegmentIndex].color }}>
  //                   <span className="value">{`${pieChartNonZeroVaules[selectedSegmentIndex].value}%`}</span>
  //                   <span>{pieChartNonZeroVaules[selectedSegmentIndex].title}</span>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="severity-prizes-wrapper">
  //           <div className="sub-title">{isNormalVault ? t("Vault.severity-prizes") : t("Vault.prizes")}</div>
  //           <div className="severity-prizes-content">
  //             <Severities
  //               preview={props.preview ?? false}
  //               severities={(description as IVaultDescription)?.severities}
  //               vault={props.data}
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </td>
  //   </tr>
  // );
}
