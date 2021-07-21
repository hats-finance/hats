import React, { useState, useEffect, useMemo } from "react";
import "../styles/Vault.scss";
import { ICommitteeMember, IPoolWithdrawRequest, ISeverity, IVault } from "../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { fromWei, isProviderAndNetwork, linkToEtherscan, truncatedAddress } from "../utils"; // numberWithCommas
import ArrowIcon from "../assets/icons/arrow.icon";
import TwitterImageIcon from "../assets/icons/twitterImage.icon";
import { RootState } from "../reducers";
import Modal from "./Shared/Modal";
import CopyToClipboard from "./Shared/CopyToClipboard";
import NFTPrize from "./NFTPrize";
import { NETWORK } from "../settings";
import { Colors, IPFS_PREFIX, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../constants/constants";
import moment from "moment";
import WithdrawCountdown from "./WithdrawCountdown";
import Tooltip from "rc-tooltip";
import InfoIcon from "../assets/icons/info.icon";

interface IProps {
  data: IVault,
  setShowModal: (show: boolean) => any,
  setModalData: (data: any) => any
}

interface IContractsCoveredProps {
  contracts: Array<string>
}

const ContractsCovered = (props: IContractsCoveredProps) => {
  return (
    <>
      {props.contracts.map((contract: string, index: number) => {
        const contractName = Object.keys(contract)[0];
        return (
          <a key={index} target="_blank" rel="noopener noreferrer" className="contract-wrapper" href={linkToEtherscan(contract?.[contractName], NETWORK)}>
            <span className="contract-name">{contractName}</span>
            <span>{truncatedAddress(contract?.[contractName])}</span>
          </a>
        )
      })}
    </>
  )
}

export default function Vault(props: IProps) {
  const [toggleRow, setToggleRow] = useState(false);
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const { totalRewardAmount, rewardsLevels, tokenPrice, honeyPotBalance, withdrawRequests, stakingTokenDecimals, apy } = props.data;
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [modalNFTData, setModalNFTData] = useState(null);
  const [showContractsModal, setShowContractsModal] = useState(false);
  const [modalContractsData, setModalContractsData] = useState(null);
  const [vaultAPY, setVaultAPY] = useState("-");
  const [isWithdrawable, setIsWithdrawable] = useState(false);
  const [isPendingWithdraw, setIsPendingWithdraw] = useState(false);
  const withdrawRequest = withdrawRequests.filter((request: IPoolWithdrawRequest) => request.beneficiary === selectedAddress);

  // TODO: This is a temp fix to the issue when the countdown gets to minus value once it reaches 0.
  const [timerChanged, setTimerChanged] = useState(false);

  useEffect(() => {
    if (selectedAddress) {
      setIsWithdrawable(moment().isBetween(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime)), moment.unix(Number(withdrawRequest[0]?.expiryTime))));
      setIsPendingWithdraw(moment().isBefore(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime))));
    }
  }, [selectedAddress, withdrawRequest])


  // temporary fix to https://github.com/hats-finance/hats/issues/29
  useEffect(() => {
    setTimeout(() => {
      if (apy) {
        setVaultAPY(`${millify(apy, { precision: 3 })}%`);
      }
    }, 1000);
  }, [setVaultAPY, apy])

  let description;
  try {
    description = JSON.parse(props.data?.description as any);
  } catch (err) {
    console.error(err);
  }


  const members = description?.committee.members.map((member: ICommitteeMember, index: number) => {
    return (
      <a className="member-link-wrapper" key={index} href={member?.["twitter-link"]} target="_blank" rel="noreferrer">
        {member?.["image-ipfs-link"] ? <img src={`${IPFS_PREFIX}${member?.["image-ipfs-link"]}`} alt="twitter avatar" className="twitter-avatar" /> : <TwitterImageIcon />}
        <span className="member-username">{member.name}</span>
      </a>
    )
  })

  const severities = useMemo(() => description?.severities.map((severity: ISeverity, index: number) => {
    let rewardPrice = "-";
    const rewardPercentage = (Number(rewardsLevels[severity.index]) / 10000) * 100;
    if (tokenPrice) {
      rewardPrice = millify(Number(fromWei(honeyPotBalance, stakingTokenDecimals)) * rewardPercentage * tokenPrice);
    }


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
                <img
                  className="nft-image"
                  src={`${IPFS_PREFIX}${severity?.["nft-metadata"]?.image?.substring(12)}`}
                  alt="NFT" />
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
  }), [tokenPrice, description?.severities, honeyPotBalance, rewardsLevels, stakingTokenDecimals])

  return (
    <>
      <tr className="inner-row">
        <td>
          <div className={toggleRow ? "arrow open" : "arrow"} onClick={() => setToggleRow(!toggleRow)}><ArrowIcon /></div>
        </td>
        <td>
          <div className="project-name-wrapper">
            <img src={description?.["Project-metadata"]?.icon} alt="project logo" />
            {description?.["Project-metadata"]?.name}
          </div>
        </td>
        <td>{millify(Number(fromWei(honeyPotBalance, stakingTokenDecimals)), { precision: 3 })}</td>
        <td>{millify(Number(fromWei(totalRewardAmount, stakingTokenDecimals)))}</td>
        <td>{vaultAPY}</td>
        <td className="action-wrapper">
          <button
            className="action-btn deposit-withdraw"
            onClick={() => { props.setShowModal(true); props.setModalData(props.data); }}
            disabled={!isProviderAndNetwork(provider)}>
            DEPOSIT / WITHDRAW
          </button>
          {selectedAddress && isPendingWithdraw && !isWithdrawable &&
            <>
              <div className="countdown-wrapper">
                <WithdrawCountdown
                  endDate={withdrawRequest[0]?.withdrawEnableTime}
                  compactView
                  onEnd={() => {
                    setTimerChanged(!timerChanged);
                    setIsPendingWithdraw(false);
                    setIsWithdrawable(true);
                  }}
                  textColor={Colors.yellow} />
              </div>
              <span>WITHDRAWAL REQUEST PENDING</span>
            </>
          }
          {selectedAddress && isWithdrawable && !isPendingWithdraw &&
            <>
              <div className="countdown-wrapper">
                <WithdrawCountdown
                  endDate={withdrawRequest[0]?.expiryTime}
                  compactView
                  onEnd={() => {
                    setTimerChanged(!timerChanged);
                    setIsWithdrawable(false);
                  }}
                />
              </div>
              <span>WITHDRAWAL AVAILABLE</span>
            </>
          }
        </td>
      </tr>
      {
        toggleRow &&
        <tr>
          <td className="sub-row" colSpan={7}>
            <div className="vault-expanded">
              <div className="committee-wrapper">
                <div className="sub-title">
                  COMMITTEE
                  {/* <Tooltip
                    overlay="A Committee is project specific and composed of researchers, project core developers, and white hat hackers. The committee is responsible to approve or deny vulnerabilities disclosed to the project, and in the case of approval, a subsequent release of funds to the hacker in accordance with the allocation specified in the vault"
                    overlayClassName="tooltip"
                    overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}>
                    <span><InfoIcon width="15" height="15" fill={Colors.white} /></span>
                  </Tooltip> */}
                </div>
                <div className="committee-content">
                  <div className="vault-expanded-subtitle">
                    Members:
                    <div className="twitter-avatars-wrapper">{members}</div>
                  </div>
                  <div className="multi-sig-wrapper">
                    <span className="vault-expanded-subtitle">Multi sig:</span>
                    <div className="multi-sig-address-wrapper">
                      <a target="_blank"
                        rel="noopener noreferrer"
                        href={linkToEtherscan(description?.committee?.["multisig-address"], NETWORK)}
                        className="multi-sig-address">
                        {truncatedAddress(description?.committee?.["multisig-address"] ?? "")}
                      </a>
                      <CopyToClipboard value={description?.committee?.["multisig-address"]} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="severity-prizes-wrapper">
                <div className="sub-title">SEVERITY PRIZES</div>
                <div className="severity-prizes-content">
                  {severities as any}
                </div>
              </div>
            </div>
          </td>
        </tr>
      }
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
