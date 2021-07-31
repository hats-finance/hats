import Tooltip from "rc-tooltip";
import { useState } from "react";
import InfoIcon from "../../assets/icons/info.icon";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../../constants/constants";
import { ISeverity } from "../../types/types";
import { calculateRewardPrice } from "../../utils";
import NFTMedia from "../NFTMedia";
import NFTPrize from "../NFTPrize";
import Modal from "../Shared/Modal";
import ContractsCovered from "./ContractsCovered";


interface IProps {
  severities: Array<ISeverity>
  rewardsLevels: Array<string>
  tokenPrice: number
  honeyPotBalance: string
  stakingTokenDecimals: string
}

export default function Severities(props: IProps) {
  const { rewardsLevels, tokenPrice, honeyPotBalance, stakingTokenDecimals } = props;
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [modalNFTData, setModalNFTData] = useState(null);
  const [showContractsModal, setShowContractsModal] = useState(false);
  const [modalContractsData, setModalContractsData] = useState(null);

  const severities = props.severities.map((severity: ISeverity, index: number) => {
    const rewardPercentage = (Number(rewardsLevels[severity.index]) / 10000) * 100;
    const rewardPrice = calculateRewardPrice(rewardPercentage, tokenPrice, honeyPotBalance, stakingTokenDecimals);

    return (
      <div className="severity-wrapper" key={index}>
        <div className={`severity-title ${severity?.name.toLocaleLowerCase()}`}>{`${severity?.name.toUpperCase()} SEVERITY`}</div>
        <div className="severity-data">
          {severity?.description &&
            <div className="severity-data-item">
              <span className="vault-expanded-subtitle">Severity description:</span>
              <span style={{ color: "white" }}>{severity.description}</span>
            </div>}
          {severity?.["nft-metadata"] &&
            <div className="severity-data-item">
              <span className="vault-expanded-subtitle">NFT:</span>
              <div className="nft-image-wrapper">
                <NFTMedia link={severity?.["nft-metadata"]?.image} />
              </div>
              <span className="view-more" onClick={() => { setShowNFTModal(true); setModalNFTData(severity as any); }}>
                View NFT info
              </span>
            </div>}
          <div className="severity-data-item">
            <span className="vault-expanded-subtitle">Prize:</span>
            <span className="vault-prize">
              <b style={{ color: "white" }}>{`${rewardPercentage}%`}</b><span className="of-vault-text">&nbsp;of vault&nbsp;</span>&#8776; {`$${rewardPrice}`}&nbsp;
              <Tooltip
                overlay="Prizes are in correlation to the funds in the vault and may change at any time"
                overlayClassName="tooltip"
                overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}>
                <span><InfoIcon width="15" height="15" fill={Colors.white} /></span>
              </Tooltip>
            </span>
            <span className="view-more" onClick={() => { setModalContractsData(severity?.["contracts-covered"] as any); setShowContractsModal(true); }}>
              View Contracts Covered
            </span>
          </div>
        </div>
      </div>
    )
  })

  return (
    <>
      {severities.reverse()}
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
    </>
  )
}


