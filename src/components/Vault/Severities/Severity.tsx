import { useSelector } from "react-redux";
import { ScreenSize, VAULTS_TYPE_SEVERITIES_COLORS } from "constants/constants";
import { RootState } from "../../../reducers";
import { IVault, ISeverity } from "../../../types/types";
import humanizeDuration from "humanize-duration";
import { useState } from "react";
import Modal from "../../Shared/Modal";
import NFTPrize from "../../NFTPrize/NFTPrize";
import ContractsCovered from "../ContractsCovered";
import { formatNumber, ipfsTransformUri } from "../../../utils";
import ArrowIcon from "../../../assets/icons/arrow.icon";
import { useSeverityReward } from "../hooks/useSeverityReward";
import "./Severity.scss";
import Media from "components/Shared/Media/Media";

interface IProps {
  severity: ISeverity
  vault: IVault
  severityIndex: number
  expanded: boolean
  expandedSeverityIndex: number | undefined
  setExpandedSeverityIndex: Function
}

export default function Severity(props: IProps) {
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [modalNFTData, setModalNFTData] = useState(null);
  const [showContractsModal, setShowContractsModal] = useState(false);
  const [modalContractsData, setModalContractsData] = useState(null);
  const { description, rewardsLevels, hackerVestedRewardSplit, hackerRewardSplit,
    committeeRewardSplit, swapAndBurnSplit, governanceHatRewardSplit, hackerHatRewardSplit, vestingDuration, stakingTokenSymbol } = props.vault;
  const { severityIndex, severity, expanded, expandedSeverityIndex } = props;
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const rewardPercentage = (Number(rewardsLevels[severity.index]) / 10000) * 100;
  const rewardPrice = useSeverityReward(props.vault, severity.index);
  const isNormalVault = !description?.["project-metadata"].type || description?.["project-metadata"].type === '';
  const orderedSeverities = props?.vault?.description?.severities.map(severity => severity.index).sort((a, b) => a - b);
  const severitiesColors = VAULTS_TYPE_SEVERITIES_COLORS[description?.["project-metadata"].type ?? "normal"];

  return (
    <div className="severity-wrapper">
      <div
        className="severity-top-wrapper"
        style={{ backgroundColor: severitiesColors?.[orderedSeverities?.indexOf(severity.index) ?? 0] }}
        onClick={() => props.setExpandedSeverityIndex(severityIndex === expandedSeverityIndex ? undefined : severityIndex)}>
        <div className="severity-title">{`${severity?.name.toUpperCase()}`}{isNormalVault && ' SEVERITY'} </div>
        <div className={expanded ? "arrow open" : "arrow"}><ArrowIcon /></div>
      </div>
      {expanded && (
        <div className="severity-data">
          {severity?.description &&
            <div className="severity-data-item">
              <span className="vault-expanded-subtitle">{isNormalVault && 'Severity '} Description:</span>
              <span style={{ color: "white" }}>{severity.description}</span>
            </div>}
          {severity?.["nft-metadata"] &&
            <div className="severity-data-item">
              <span className="vault-expanded-subtitle">NFT:</span>
              <div className="nft-image-wrapper" onClick={() => { setShowNFTModal(true); setModalNFTData(severity as any); }}>
                <Media link={ipfsTransformUri(severity?.["nft-metadata"]?.image)} className="nft-image" />
                <span className="view-more">
                  View NFT info
                </span>
              </div>
            </div>}
          <div className="severity-data-item">
            <span className="vault-expanded-subtitle">Max Prize:</span>
            <span className="vault-prize">
              <b style={{ color: "white" }}>
                {`${rewardPercentage.toFixed(2)}%`}
              </b>
              <span className="of-vault-text">
                &nbsp;of vault&nbsp;
              </span>
              &#8776; {`$${formatNumber(rewardPrice)}`}&nbsp;
            </span>
            {
              screenSize === ScreenSize.Desktop && rewardPrice && (
                <>
                  <span className="vault-expanded-subtitle">Prize Content Division:</span>
                  <div className="severity-prize-division-wrapper">
                    {(Number(hackerVestedRewardSplit) / 100) > 0 && <span className="division vested-token">{`${Number(hackerVestedRewardSplit) / 100}% Vested ${stakingTokenSymbol} for ${humanizeDuration(Number(vestingDuration) * 1000, { units: ["d", "h", "m"] })} (Hacker reward) ≈ $${formatNumber((Number(hackerVestedRewardSplit) / 10000) * rewardPrice)}`}</span>}
                    {(Number(hackerRewardSplit) / 100) > 0 && <span className="division token">{`${Number(hackerRewardSplit) / 100}% ${stakingTokenSymbol} (Hacker reward) ≈ $${formatNumber((Number(hackerRewardSplit) / 10000) * rewardPrice)}`}</span>}
                    {(Number(committeeRewardSplit) / 100) > 0 && <span className="division committee">{`${Number(committeeRewardSplit) / 100}% Committee ≈ $${formatNumber((Number(committeeRewardSplit) / 10000) * rewardPrice)}`}</span>}
                    {(Number(hackerHatRewardSplit) / 100) > 0 && <span className="division vested-hats">{`${Number(hackerHatRewardSplit) / 100}% Vested Hats for ${humanizeDuration(Number(props.vault.master.vestingHatDuration) * 1000, { units: ["d", "h", "m"] })} (Hacker reward) pending start of TGE ≈ $${formatNumber((Number(hackerHatRewardSplit) / 10000) * rewardPrice)}`}</span>}
                    {(Number(governanceHatRewardSplit) / 100) > 0 && <span className="division governance">{`${Number(governanceHatRewardSplit) / 100}% Governance ≈ $${formatNumber((Number(governanceHatRewardSplit) / 10000) * rewardPrice)}`}</span>}
                    {(Number(swapAndBurnSplit) / 100) > 0 && <span className="division swap-and-burn">{`${Number(swapAndBurnSplit) / 100}% Swap and Burn ≈ $${formatNumber((Number(swapAndBurnSplit) / 10000) * rewardPrice)}`}</span>}
                  </div>
                </>
              )
            }
            <span className="view-more" onClick={() => { setModalContractsData(severity?.["contracts-covered"] as any); setShowContractsModal(true); }}>
              View Contracts Covered
            </span>
          </div>
        </div>
      )}
      {
        showNFTModal &&
        <Modal title="NFT PRIZE" setShowModal={setShowNFTModal} maxWidth="600px" width="60%" height="fit-content">
          <NFTPrize data={modalNFTData as any} />
        </Modal>
      }
      {
        showContractsModal &&
        <Modal title="CONTRACTS COVERED" setShowModal={setShowContractsModal} height="fit-content">
          <div className="contracts-covered-modal-wrapper"><ContractsCovered contracts={modalContractsData as any} /></div>
        </Modal>
      }
    </div>
  )
}
