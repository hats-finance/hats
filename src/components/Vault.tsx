import React, { useState } from "react";
import "../styles/Vault.scss";
import { IVault } from "../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { fromWei, isProviderAndNetwork, numberWithCommas, truncatedAddress } from "../utils";
import ArrowIcon from "../assets/icons/arrow.icon";
import { RootState } from "../reducers";
import Modal from "./Shared/Modal";
import NFTPrize from "./NFTPrize";

interface IProps {
  data: IVault,
  setShowModal: (show: boolean) => any,
  setModalData: (data: any) => any
}

// TODO: until the IPFS data will be updated in the subgraph for each vault
const tempIPFSData = {
  "communication-channel": {
    "committee-bot": "https://170.29.30.40/comchan",
    "pgp-pk": "-----BEGIN PGP PUBLIC KEY BLOCK-----Comment: Alice's OpenPGP certificatemDMEXEcE6RYJKwYBBAHaRw8BAQdArjWwk3FAqyiFbFBKT4TzXcVBqPTB3gmzlC/Ub7O1u120JkFsaWNlIExvdmVsYWNlIDxhbGljZUBvcGVucGdwLmV4YW1wbGU+iJAE"
  },
  "committee": {
    "multisig-address": "0x536835937de4340f73d98ac94a6be3da98f51fe3",
    "members": [{
      "name": "andre",
      "address": "0x536835937de4340f73d98ac94a6be3da98f51fe3",
      "twitter-link": "https://twitter.com/andre"
    },
    {
      "name": "loren",
      "address": "0x536835937de4340f73d98ac94a6be3da98f51fe3",
      "twitter-link": "https://twitter.com/loren"
    }
    ]
  },
  "severities": [{
    "name": "low",
    "contracts-covered": [
      "0x536835937de4340f73d98ac94a6be3da98f51fe3",
      "0xD11Eb5Db7cFbB9ECae4B62E71Ec0A461F6baF669",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ],
    "nft-link": "https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/124178",
    "reward-for": "lorem ipsum low"
  },
  {
    "name": "medium",
    "contracts-covered": [
      "0x536835937de4340f73d98ac94a6be3da98f51fe3",
      "0xD11Eb5Db7cFbB9ECae4B62E71Ec0A461F6baF669",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ],
    "nft-link": "https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/124178",
    "reward-for": "lorem ipsum medium"
  },
  {
    "name": "high",
    "contracts-covered": [
      "0x536835937de4340f73d98ac94a6be3da98f51fe3",
      "0xD11Eb5Db7cFbB9ECae4B62E71Ec0A461F6baF669",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ],
    "nft-link": "https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/124178",
    "reward-for": "lorem ipsum high"
  },
  {
    "name": "critical",
    "contracts-covered": [
      "0x536835937de4340f73d98ac94a6be3da98f51fe3",
      "0xD11Eb5Db7cFbB9ECae4B62E71Ec0A461F6baF669",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ],
    "nft-link": "https://opensea.io/assets/0xd07dc4262bcdbf85190c01c996b4c06a461d2430/124178",
    "reward-for": "lorem ipsum critical"
  }
  ]
}

export default function Vault(props: IProps) {
  const [toggleRow, setToggleRow] = useState(false);
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const { name, totalStaking, numberOfApprovedClaims, apy, totalRewardAmount } = props.data;
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  // <td className="sub-cell" colSpan={7}>{`Vulnerabilities Submitted: ${numberWithCommas(Number(master.numberOfSubmittedClaims))}`}</td>


  // TODO: add types for the tempIPFSData
  const members = tempIPFSData.committee.members.map((member: any, index: number) => {
    return <a key={index} className="member-link" href={member["twitter-link"]} target="_blank" rel="noreferrer">{member.name}</a>
  })

  const severities = tempIPFSData.severities.map((severity: any, index: number) => {
    return (
      <div className="severity-wrapper" key={index}>
        <div className="severity-title">{severity.name.toUpperCase()}</div>
        <div className="severity-data">
          <div className="severity-data-item">
            <span className="severity-data-title">Contracts Covered:</span>
            {severity["contracts-covered"].map((contract: any, index: number) => {
              return <span key={index} className="severity-data-contract">{`Contract name ${truncatedAddress(contract)}`}</span>
            })}
            <span className="view-all">View all</span>
          </div>
          <div className="severity-data-item">
            <span className="severity-data-title">Prize:</span>
            <span>{severity["reward-for"]}</span>
          </div>
          {severity["nft-link"] &&
            <div className="severity-data-item">
              <span className="severity-data-title">NFT:</span>
              <img src={severity["nft-link"]} alt="NFT" className="nft-image" onClick={() => { setShowModal(true); setModalData(severity); }} />
            </div>}
        </div>
      </div>
    )
  })

  return (
    <>
      <tr className="inner-row">
        <td>
          <div className={toggleRow ? "arrow open" : "arrow"} onClick={() => setToggleRow(!toggleRow)}><ArrowIcon /></div>
        </td>
        <td style={{ textAlign: "left" }}>{name}</td>
        <td>{millify(Number(fromWei(totalStaking)))}</td>
        <td>{numberWithCommas(Number(numberOfApprovedClaims))}</td>
        <td>{millify(Number(fromWei(totalRewardAmount)))}</td>
        <td>{!apy ? "-" : `${millify(apy)}%`}</td>
        <td>
          <button
            className="action-btn"
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
                  <div>Members: {members}</div>
                  <div>Multi sig: <span className="multi-sig-address">{truncatedAddress(tempIPFSData.committee["multisig-address"])}</span></div>
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
      {showModal &&
        <Modal title="NFT PRIZE" setShowModal={setShowModal} >
          <NFTPrize data={modalData} />
        </Modal>}
    </>
  )
}
