import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useTranslation } from "react-i18next";
import humanizeDuration from "humanize-duration";
import { Modal, NFTPrize, Media } from "components";
import useModal from "hooks/useModal";
import { IVault, IVulnerabilitySeverity } from "types";
import { formatNumber, ipfsTransformUri } from "utils";
import ArrowIcon from "assets/icons/arrow.icon";
import { useSeverityReward } from "../../hooks/useSeverityReward";
import "./Severity.scss";
import { ContractsCovered } from "../ContractsCovered/ContractsCovered";

interface IProps {
  severity: IVulnerabilitySeverity;
  vault: IVault;
  severityIndex: number;
  preview: boolean;
  expanded: boolean;
  expandedSeverityIndex: number | undefined;
  setExpandedSeverityIndex: Function;
}

export default function Severity(props: IProps) {
  const {
    description,
    hackerVestedRewardSplit,
    hackerRewardSplit,
    committeeRewardSplit,
    // swapAndBurnSplit,
    governanceHatRewardSplit,
    hackerHatRewardSplit,
    vestingDuration,
    stakingTokenSymbol,
    master,
    version,
  } = props.vault;
  const { t } = useTranslation();
  const { severityIndex, severity, expanded, expandedSeverityIndex } = props;

  const { isShowing: isShowingNFTModal, show: showNFTModal, hide: hideNFTModal } = useModal();
  const { isShowing: isShowingContractsModal, show: showContractsModal, hide: hideContractsModal } = useModal();
  const [modalNFTData, setModalNFTData] = useState(null);
  const [modalContractsData, setModalContractsData] = useState(null);
  const { rewardPrice, rewardPercentage, rewardColor } = useSeverityReward(props.vault, severityIndex);

  const isNormalVault =
    !description?.["project-metadata"].type ||
    description?.["project-metadata"].type === "" ||
    description?.["project-metadata"].type === "normal";

  const getPrizeContentDivision = () => {
    const bountyVestingDuration = humanizeDuration(Number(vestingDuration) * 1000, {
      units: ["d", "h", "m"],
    });
    const rewardVestingDuration = humanizeDuration(Number(master.vestingHatDuration) * 1000, {
      units: ["d", "h", "m"],
    });

    const governanceSplit = BigNumber.from(governanceHatRewardSplit).eq(ethers.constants.MaxUint256)
      ? master.defaultGovernanceHatRewardSplit
      : governanceHatRewardSplit;
    const hackerHatsSplit = BigNumber.from(hackerHatRewardSplit).eq(ethers.constants.MaxUint256)
      ? master.defaultHackerHatRewardSplit
      : hackerHatRewardSplit;

    // In v2 vaults the split sum (immediate, vested, committee) is 100%. So we need to calculate the split factor to get the correct values.
    // In v1 this is not a probem. So the factor is 1.
    const splitFactor = version === "v1" ? 1 : (10000 - Number(governanceSplit) - Number(hackerHatsSplit)) / 100 / 100;

    return [
      {
        // Immediate bounty
        title: t("immediateBountyInTokens", { token: stakingTokenSymbol }),
        percentage: (Number(hackerRewardSplit) / 100) * splitFactor,
        amountInUsd: formatNumber((((Number(hackerRewardSplit) / 100) * splitFactor) / 100) * rewardPrice),
        className: "token",
      },
      {
        // Vested bounty
        title: t("vestedBountyForDurationInTokens", { duration: bountyVestingDuration, token: stakingTokenSymbol }),
        percentage: (Number(hackerVestedRewardSplit) / 100) * splitFactor,
        amountInUsd: formatNumber((((Number(hackerVestedRewardSplit) / 100) * splitFactor) / 100) * rewardPrice),
        className: "vested-token",
      },
      {
        // Committee fe
        title: t("committeeFee"),
        percentage: (Number(committeeRewardSplit) / 100) * splitFactor,
        amountInUsd: formatNumber((((Number(committeeRewardSplit) / 100) * splitFactor) / 100) * rewardPrice),
        className: "committee",
      },
      {
        title: t("vestedHatsForDuration", { duration: rewardVestingDuration }),
        percentage: Number(hackerHatsSplit) / 100,
        amountInUsd: formatNumber((((Number(hackerHatsSplit) / 100) * splitFactor) / 100) * rewardPrice),
        className: "vested-hats",
      },
      {
        title: t("hatsGovFee"),
        percentage: Number(governanceSplit) / 100,
        amountInUsd: formatNumber((((Number(governanceSplit) / 100) * splitFactor) / 100) * rewardPrice),
        className: "governance",
      },
      // {
      //   title: `Swap and burn`,
      //   percentage: Number(swapAndBurnSplit) / 100,
      //   amountInUsd: formatNumber((((Number(swapAndBurnSplit) / 100) * splitFactor) / 100) * rewardPrice),
      //   className: 'swap-and-burn',
      // },
    ];
  };

  return (
    <div className="severity-wrapper">
      <div
        className="severity-top-wrapper"
        style={{ backgroundColor: rewardColor }}
        onClick={() => props.setExpandedSeverityIndex(severityIndex === expandedSeverityIndex ? undefined : severityIndex)}
      >
        <div className="severity-title">
          {`${severity?.name.toUpperCase()}`}
          {isNormalVault && " SEVERITY"}{" "}
        </div>
        <div className={expanded ? "arrow open" : "arrow"}>
          <ArrowIcon />
        </div>
      </div>
      {expanded && (
        <div className="severity-data">
          <div className="row">
            {severity?.description && (
              <div className="severity-data-item">
                <span className="vault-expanded-subtitle">
                  {isNormalVault && "Severity "} {t("description")}:
                </span>
                <span style={{ color: "white" }}>{severity.description}</span>
              </div>
            )}
          </div>
          <div className="row">
            {severity?.["nft-metadata"] && (
              <div className="severity-data-item nft-section">
                <span className="vault-expanded-subtitle">NFT:</span>
                <div
                  className="nft-image-wrapper"
                  onClick={() => {
                    showNFTModal();
                    setModalNFTData(severity as any);
                  }}
                >
                  <Media link={ipfsTransformUri(severity?.["nft-metadata"]?.image)} className="nft-image" />
                  <span className="view-more">{t("viewNftInfo")}</span>
                </div>
              </div>
            )}
            <div className="severity-data-item">
              <span className="vault-expanded-subtitle">{t("maxPrize")}:</span>
              <span className="vault-prize">
                <b style={{ color: "white" }}>{`${rewardPercentage.toFixed(2)}%`}</b>
                <span className="of-vault-text">&nbsp;{t("ofVault")}&nbsp;</span>
                &#8776; {`$${formatNumber(rewardPrice)}`}&nbsp;
              </span>
              {rewardPrice && (
                <>
                  <span className="vault-expanded-subtitle">{t("prizeContentDivision")}:</span>
                  <div className="severity-prize-division-wrapper">
                    {getPrizeContentDivision().map(
                      (division, index) =>
                        division.percentage > 0 && (
                          <span key={index} className={`division ${division.className}`}>
                            {division.percentage}% {division.title} ≈ ${division.amountInUsd}
                          </span>
                        )
                    )}
                  </div>
                </>
              )}
              <span
                className="view-more"
                onClick={() => {
                  setModalContractsData(severity?.["contracts-covered"] as any);
                  showContractsModal();
                }}
              >
                {t("viewContractsCovered")}
              </span>
            </div>
          </div>
        </div>
      )}

      <Modal isShowing={isShowingNFTModal} title="NFT PRIZE" onHide={hideNFTModal} withTitleDivider>
        <NFTPrize data={modalNFTData as any} />
      </Modal>

      <Modal isShowing={isShowingContractsModal} title="CONTRACTS COVERED" onHide={hideContractsModal} withTitleDivider>
        <ContractsCovered contracts={modalContractsData as any} vault={props.vault} />
      </Modal>
    </div>
  );
}
