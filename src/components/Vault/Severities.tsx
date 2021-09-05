import { useState } from "react";
import { IParentVault, ISeverity } from "../../types/types";
import { calculateRewardPrice } from "../../utils";
import NFTMedia from "../NFTMedia";
import NFTPrize from "../NFTPrize";
import Modal from "../Shared/Modal";
import ContractsCovered from "./ContractsCovered";

interface IProps {
  severities: Array<ISeverity>
  parentVault: IParentVault
}

export default function Severities(props: IProps) {
  const { rewardsLevels, tokenPrice, honeyPotBalance, stakingTokenDecimals, hackerVestedRewardSplit, hackerRewardSplit, committeeRewardSplit, swapAndBurnSplit, governanceHatRewardSplit, hackerHatRewardSplit } = props.parentVault;
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [modalNFTData, setModalNFTData] = useState(null);
  const [showContractsModal, setShowContractsModal] = useState(false);
  const [modalContractsData, setModalContractsData] = useState(null);

  const severities = props.severities?.map((severity: ISeverity, index: number) => {
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
              <div className="nft-image-wrapper" onClick={() => { setShowNFTModal(true); setModalNFTData(severity as any); }}>
                <NFTMedia link={severity?.["nft-metadata"]?.image} />
                <span className="view-more">
                  View NFT info
                </span>
              </div>
            </div>}
          <div className="severity-data-item">
            <span className="vault-expanded-subtitle">Max Prize:</span>
            <span className="vault-prize">
              <b style={{ color: "white" }}>{`${rewardPercentage}%`}</b><span className="of-vault-text">&nbsp;of vault&nbsp;</span>&#8776; {`$${rewardPrice}`}&nbsp;
            </span>
            <span className="vault-expanded-subtitle">Prize Content division:</span>
            <div className="severity-prize-division-wrapper">
              {/* {rewardPrice && <span>&#8776; {percentage(Number(hackerVestedRewardSplit) / 100, rewardPrice)}</span>} */}
              <span className="division vested-yfi">{`${Number(hackerVestedRewardSplit) / 100}% Vested YFI`}</span>
              <span className="division yfi">{`${Number(hackerRewardSplit) / 100}% YFI`}</span>
              <span className="division committee">{`${Number(committeeRewardSplit) / 100}% Committee`}</span>
              <span className="division vested-hats">{`${Number(hackerHatRewardSplit) / 100}% Vested Hats`}</span>
              <span className="division governance">{`${Number(governanceHatRewardSplit) / 100}% Governance`}</span>
              {(Number(swapAndBurnSplit) / 100) > 0 && <span className="division swap-and-burn">{`${Number(swapAndBurnSplit) / 100}% Swap and Burn`}</span>}
            </div>
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
      {severities?.reverse()}
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


