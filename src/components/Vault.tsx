import React, { useState } from "react";
import "../styles/Vault.scss";
import { ICommitteeMember, ISeverity, IVault } from "../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { fromWei, isProviderAndNetwork, linkToEtherscan, numberWithCommas, truncatedAddress } from "../utils";
import ArrowIcon from "../assets/icons/arrow.icon";
import ZoomIcon from "../assets/icons/zoom.icon";
import { RootState } from "../reducers";
import Modal from "./Shared/Modal";
import CopyToClipboard from "./Shared/CopyToClipboard";
import NFTPrize from "./NFTPrize";
import { NETWORK } from "../settings";

interface IProps {
  data: IVault,
  setShowModal: (show: boolean) => any,
  setModalData: (data: any) => any
}

export default function Vault(props: IProps) {
  const [toggleRow, setToggleRow] = useState(false);
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const { name, totalStaking, numberOfApprovedClaims, apy, totalRewardAmount, rewardsLevels, tokenPrice, honeyPotBalance } = props.data;
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  // <td className="sub-cell" colSpan={7}>{`Vulnerabilities Submitted: ${numberWithCommas(Number(master.numberOfSubmittedClaims))}`}</td>

  const description = JSON.parse(props.data.description as any);

  const members = description?.committee.members.map((member: ICommitteeMember, index: number) => {
    return <a key={index} className="member-link" href={member["twitter-link"]} target="_blank" rel="noreferrer">{member.name}</a>
  })

  const severities = React.useCallback(description?.severities.map((severity: ISeverity, index: number) => {
    let rewardPrice = "-";
    const rewardPercentage = (Number(rewardsLevels[severity.index]) / 10000) * 100;
    if (tokenPrice) {
      rewardPrice = millify(Number(fromWei(honeyPotBalance)) * rewardPercentage * tokenPrice);
    }

    return (
      <div className="severity-wrapper" key={index}>
        <div className={`severity-title ${severity.name.toLocaleLowerCase()}`}>{severity.name.toUpperCase()}</div>
        <div className="severity-data">
          <div className="severity-data-item">
            <span className="vault-expanded-subtitle">Contracts Covered:</span>
            {severity["contracts-covered"].map((contract: string, index: number) => {
              const contractName = Object.keys(contract)[0];
              return (
                <a key={index} target="_blank" rel="noopener noreferrer" className="contract-wrapper" href={linkToEtherscan(contract[contractName], NETWORK)}>
                  <span className="contract-name">{contractName}</span>
                  <span>{truncatedAddress(contract[contractName])}</span>
                </a>
              )
            })}
            <span className="view-all">View all</span>
          </div>
          <div className="severity-data-item">
            <span className="vault-expanded-subtitle">Prize:</span>
            <span><b style={{ color: "white" }}>{`${rewardPercentage}%`}</b><span style={{ color: "white" }}> of Vault</span> &#8776; {`$${rewardPrice}`}</span>
          </div>
          {severity["nft-metadata"] &&
            <div className="severity-data-item">
              <span className="vault-expanded-subtitle">NFT:</span>
              <div className="nft-image-wrapper" onClick={() => { setShowModal(true); setModalData(severity as any); }}>
                <div className="zoom-icon"><ZoomIcon /></div>
                <img
                  className="nft-image"
                  src={`https://ipfs.io/ipfs/${severity["nft-metadata"].image.substring(12)}`}
                  alt="NFt" />
              </div>
            </div>}
        </div>
      </div>
    )
  }), [tokenPrice])

  return (
    <>
      <tr className="inner-row">
        <td>
          <div className={toggleRow ? "arrow open" : "arrow"} onClick={() => setToggleRow(!toggleRow)}><ArrowIcon /></div>
        </td>
        <td>
          <div className="project-name-wrapper">
            <img src={description["Project-metadata"].icon} alt="project logo" />
            {name}
          </div>
        </td>
        <td>{millify(Number(fromWei(totalStaking)))}</td>
        <td>{numberWithCommas(Number(numberOfApprovedClaims))}</td>
        <td>{millify(Number(fromWei(totalRewardAmount)))}</td>
        <td>{!apy ? "-" : `${millify(apy)}%`}</td>
        <td>
          <button
            className="action-btn deposit-withdraw"
            onClick={() => { props.setShowModal(true); props.setModalData(props.data) }}
            disabled={!isProviderAndNetwork(provider)}>
            DEPOSIT / WITHDRAW
          </button>
        </td>
      </tr>
      {
        toggleRow &&
        <tr>
          <td className="sub-row" colSpan={7}>
            <div className="vault-expanded">
              <div className="committee-wrapper">
                <div className="sub-title">Committee</div>
                <div className="committee-content">
                  <div className="vault-expanded-subtitle">Members: {members}</div>
                  <div className="multi-sig-wrapper">
                    <div>
                      <span className="vault-expanded-subtitle">Multi sig:</span>
                      <a target="_blank"
                        rel="noopener noreferrer"
                        href={linkToEtherscan(description?.committee["multisig-address"], NETWORK)}
                        className="multi-sig-address">
                        {truncatedAddress(description?.committee["multisig-address"])}
                      </a>
                    </div>
                    <CopyToClipboard value={description?.committee["multisig-address"]} />
                  </div>
                </div>
              </div>
              <div className="severity-prizes-wrapper">
                <div className="sub-title">Severity prizes</div>
                <div className="severity-prizes-content">
                  {severities}
                </div>
              </div>
            </div>
          </td>
        </tr>
      }
      {
        showModal &&
        <Modal title="NFT PRIZE" setShowModal={setShowModal} maxWidth="800px" width="60%" height="fit-content">
          <NFTPrize data={modalData as any} />
        </Modal>
      }
    </>
  )
}
