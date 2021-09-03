import { useState } from "react";
import { IParentVault, ISeverity } from "../../types/types";
import { calculateRewardPrice } from "../../utils";
import NFTMedia from "../NFTMedia";
import NFTPrize from "../NFTPrize";
import Modal from "../Shared/Modal";
import ContractsCovered from "./ContractsCovered";
import { PieChart } from "react-minimal-pie-chart";
import { PieChartColors } from "../../constants/constants";


interface IProps {
  severities: Array<ISeverity>
  parentVault: IParentVault
}

export default function Severities(props: IProps) {
  const { rewardsLevels, tokenPrice, honeyPotBalance, stakingTokenDecimals, hackerVestedRewardSplit,
    hackerRewardSplit, committeeRewardSplit, swapAndBurnSplit, governanceHatRewardSplit, hackerHatRewardSplit } = props.parentVault;
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [modalNFTData, setModalNFTData] = useState(null);
  const [showContractsModal, setShowContractsModal] = useState(false);
  const [modalContractsData, setModalContractsData] = useState(null);

  const pieChartData = [
    { title: 'Vested YFI', value: Number(hackerVestedRewardSplit) / 10000, color: PieChartColors.vestedYFI },
    { title: 'YFI', value: Number(hackerRewardSplit) / 10000, color: PieChartColors.yfi },
    { title: 'Committee', value: Number(committeeRewardSplit) / 10000, color: PieChartColors.committee },
    { title: 'Vested Hats', value: Number(hackerHatRewardSplit) / 10000, color: PieChartColors.vestedHats },
    { title: 'Governance', value: Number(governanceHatRewardSplit) / 10000, color: PieChartColors.governance },
    { title: 'Swap and Burn', value: Number(swapAndBurnSplit) / 10000, color: PieChartColors.swapAndBurn },
  ];

  const [pieLabel, setPieLabel] = useState(`${pieChartData[0].value}% ${pieChartData[0].title}`);

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
              <div className="nft-image-wrapper">
                <NFTMedia link={severity?.["nft-metadata"]?.image} />
              </div>
              <span className="view-more" onClick={() => { setShowNFTModal(true); setModalNFTData(severity as any); }}>
                View NFT info
              </span>
            </div>}
          <div className="severity-data-item">
            <span className="vault-expanded-subtitle">Max Prize and content division:</span>

            {/* <span className="vault-prize">
              <b style={{ color: "white" }}>{`${rewardPercentage}%`}</b><span className="of-vault-text">&nbsp;of vault&nbsp;</span>&#8776; {`$${rewardPrice}`}&nbsp;
            </span> */}

            <div className="pie-chart-wrapper">
              <PieChart
                label={() => `${rewardPercentage}% $${rewardPrice}`}
                labelStyle={{
                  fontSize: '10px',
                  fontFamily: 'sans-serif',
                  fill: '#E38627',
                }}
                labelPosition={0}
                center={[100, 50]}
                viewBoxSize={[200, 100]}
                onMouseOver={(e, segmentIndex) => setPieLabel(`${pieChartData[segmentIndex].value}% ${pieChartData[segmentIndex].title}`)}
                lineWidth={15}
                data={pieChartData}
              />
              <span>{pieLabel}</span>
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


