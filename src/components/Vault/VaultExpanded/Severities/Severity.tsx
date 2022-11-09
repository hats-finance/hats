import { useState } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "constants/constants";
import humanizeDuration from "humanize-duration";
import { Modal, NFTPrize, Media } from "components";
import useModal from "hooks/useModal";
import { RootState } from "reducers";
import { IVault, IVulnerabilitySeverity } from "types/types";
import { formatNumber, ipfsTransformUri } from "utils";
import ArrowIcon from "assets/icons/arrow.icon";
import { useSeverityReward } from "../../hooks/useSeverityReward";
import "./Severity.scss";
import { ContractsCovered } from "../ContractsCovered/ContractsCovered";

interface IProps {
  severity: IVulnerabilitySeverity;
  vault: IVault;
  severityIndex: number;
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
    swapAndBurnSplit,
    governanceHatRewardSplit,
    hackerHatRewardSplit,
    vestingDuration,
    stakingTokenSymbol,
  } = props.vault;
  const { severityIndex, severity, expanded, expandedSeverityIndex } = props;

  const { isShowing: isShowingNFTModal, show: showNFTModal, hide: hideNFTModal } = useModal();
  const { isShowing: isShowingContractsModal, show: showContractsModal, hide: hideContractsModal } = useModal();
  const [modalNFTData, setModalNFTData] = useState(null);
  const [modalContractsData, setModalContractsData] = useState(null);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const { rewardPrice, rewardPercentage, rewardColor } = useSeverityReward(props.vault, severityIndex);

  const isNormalVault = !description?.["project-metadata"].type || description?.["project-metadata"].type === "";

  return (
    <div className="severity-wrapper">
      <div
        className="severity-top-wrapper"
        style={{ backgroundColor: rewardColor }}
        onClick={() => props.setExpandedSeverityIndex(severityIndex === expandedSeverityIndex ? undefined : severityIndex)}>
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
          {severity?.description && (
            <div className="severity-data-item">
              <span className="vault-expanded-subtitle">{isNormalVault && "Severity "} Description:</span>
              <span style={{ color: "white" }}>{severity.description}</span>
            </div>
          )}
          {severity?.["nft-metadata"] && (
            <div className="severity-data-item">
              <span className="vault-expanded-subtitle">NFT:</span>
              <div
                className="nft-image-wrapper"
                onClick={() => {
                  showNFTModal();
                  setModalNFTData(severity as any);
                }}>
                <Media link={ipfsTransformUri(severity?.["nft-metadata"]?.image)} className="nft-image" />
                <span className="view-more">View NFT info</span>
              </div>
            </div>
          )}
          <div className="severity-data-item">
            <span className="vault-expanded-subtitle">Max Prize:</span>
            <span className="vault-prize">
              <b style={{ color: "white" }}>{`${rewardPercentage.toFixed(2)}%`}</b>
              <span className="of-vault-text">&nbsp;of vault&nbsp;</span>
              &#8776; {`$${formatNumber(rewardPrice)}`}&nbsp;
            </span>
            {screenSize === ScreenSize.Desktop && rewardPrice && (
              <>
                <span className="vault-expanded-subtitle">Prize Content Division:</span>
                <div className="severity-prize-division-wrapper">
                  {Number(hackerVestedRewardSplit) / 100 > 0 && (
                    <span className="division vested-token">{`${
                      Number(hackerVestedRewardSplit) / 100
                    }% Vested ${stakingTokenSymbol} for ${humanizeDuration(Number(vestingDuration) * 1000, {
                      units: ["d", "h", "m"],
                    })} (Hacker reward) ≈ $${formatNumber((Number(hackerVestedRewardSplit) / 10000) * rewardPrice)}`}</span>
                  )}
                  {Number(hackerRewardSplit) / 100 > 0 && (
                    <span className="division token">{`${
                      Number(hackerRewardSplit) / 100
                    }% ${stakingTokenSymbol} (Hacker reward) ≈ $${formatNumber(
                      (Number(hackerRewardSplit) / 10000) * rewardPrice
                    )}`}</span>
                  )}
                  {Number(committeeRewardSplit) / 100 > 0 && (
                    <span className="division committee">{`${Number(committeeRewardSplit) / 100}% Committee ≈ $${formatNumber(
                      (Number(committeeRewardSplit) / 10000) * rewardPrice
                    )}`}</span>
                  )}
                  {Number(hackerHatRewardSplit) / 100 > 0 && (
                    <span className="division vested-hats">{`${
                      Number(hackerHatRewardSplit) / 100
                    }% Vested Hats for ${humanizeDuration(Number(props.vault.master.vestingHatDuration) * 1000, {
                      units: ["d", "h", "m"],
                    })} (Hacker reward) pending start of TGE ≈ $${formatNumber(
                      (Number(hackerHatRewardSplit) / 10000) * rewardPrice
                    )}`}</span>
                  )}
                  {Number(governanceHatRewardSplit) / 100 > 0 && (
                    <span className="division governance">{`${
                      Number(governanceHatRewardSplit) / 100
                    }% Governance ≈ $${formatNumber((Number(governanceHatRewardSplit) / 10000) * rewardPrice)}`}</span>
                  )}
                  {Number(swapAndBurnSplit) / 100 > 0 && (
                    <span className="division swap-and-burn">{`${Number(swapAndBurnSplit) / 100}% Swap and Burn ≈ $${formatNumber(
                      (Number(swapAndBurnSplit) / 10000) * rewardPrice
                    )}`}</span>
                  )}
                </div>
              </>
            )}
            <span
              className="view-more"
              onClick={() => {
                setModalContractsData(severity?.["contracts-covered"] as any);
                showContractsModal();
              }}>
              View Contracts Covered
            </span>
          </div>
        </div>
      )}

      <Modal isShowing={isShowingNFTModal} title="NFT PRIZE" onHide={hideNFTModal} withTitleDivider>
        <NFTPrize data={modalNFTData as any} />
      </Modal>

      <Modal isShowing={isShowingContractsModal} title="CONTRACTS COVERED" onHide={hideContractsModal} withTitleDivider>
        <ContractsCovered contracts={modalContractsData as any} />
      </Modal>
    </div>
  );
}
