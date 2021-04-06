import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalletBalance, fromWei, getNetworkNameByChainId, isDigitsOnly, numberWithCommas } from "../utils";
import Loading from "./Shared/Loading";
import InfoIcon from "../assets/icons/info.icon";
import "../styles/DepositWithdraw.scss";
import * as contractsActions from "../actions/contractsActions";
import { IVault } from "../types/types";
import { getStakerAmountByVaultID } from "../graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import { BigNumber } from "@ethersproject/bignumber";
import { RootState } from "../reducers";
import Logo from "../assets/icons/logo.icon";
import Tooltip from "rc-tooltip";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../constants/constants";
import millify from "millify";
import classNames from "classnames";

interface IProps {
  data: IVault,
  updateVualts: Function
}

export default function DepositWithdraw(props: IProps) {
  const dispatch = useDispatch();
  const { id, pid, master, stakingToken, name } = props.data;
  const [isDeposit, setIsDeposit] = useState(true);
  const [userInput, setUserInput] = useState("0");
  const [isApproved, setIsApproved] = useState(false);
  const [inTransaction, setInTransaction] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const notEnoughBalance = parseInt(userInput) > parseInt(tokenBalance);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const network = getNetworkNameByChainId(chainId);
  const { loading, error, data, refetch } = useQuery(getStakerAmountByVaultID(id, selectedAddress));

  const stakedAmount: BigNumber = useMemo(() => {
    if (!loading && !error && data && data.stakers) {
      return data.stakers[0]?.amount ?? BigNumber.from(0);
    }
    return BigNumber.from(0);
  }, [loading, error, data])

  const canWithdraw = stakedAmount && Number(fromWei(stakedAmount)) >= Number(userInput);
  const percentageValue = isDeposit ? tokenBalance : fromWei(stakedAmount);

  React.useEffect(() => {
    const checkIsApproved = async () => {
      setIsApproved(await contractsActions.isApproved(stakingToken, selectedAddress, master.address));
    }
    checkIsApproved();
  }, [stakingToken, selectedAddress, master.address]);

  React.useEffect(() => {
    const getTokenData = async () => {
      setTokenBalance(await contractsActions.getTokenBalance(stakingToken, selectedAddress));
      setTokenSymbol(await contractsActions.getTokenSymbol(stakingToken));
    }
    getTokenData();
  }, [stakingToken, selectedAddress, inTransaction]);

  const [pendingReward, setPendingReward] = useState(BigNumber.from(0));

  React.useEffect(() => {
    const getPendingReward = async () => {
      setPendingReward(await contractsActions.getPendingReward(master.address, pid, selectedAddress));
    }
    getPendingReward();
  }, [master.address, selectedAddress, pid, inTransaction])

  const approveToken = async () => {
    setInTransaction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.approveToken(stakingToken, master.address),
      async () => {
        setIsApproved(true);
      },
      () => { }, dispatch, `Spending ${tokenSymbol} approved`);
    setInTransaction(false);
  }

  const deposit = async () => {
    setInTransaction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.deposit(pid, master.address, userInput),
      async () => {
        refetch();
        props.updateVualts();
        setUserInput("0");
      }, () => { }, dispatch, `Deposited ${userInput} ${tokenSymbol}`);
    setInTransaction(false);
  }

  const withdraw = async () => {
    setInTransaction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.withdraw(pid, master.address, userInput),
      async () => {
        refetch();
        props.updateVualts();
        setUserInput("0");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { }, dispatch, `Withdrawn ${userInput} ${tokenSymbol}`);
    setInTransaction(false);
  }

  const claim = async () => {
    setInTransaction(true);
    await contractsActions.createTransaction(
      async () => contractsActions.claim(pid, master.address),
      async () => {
        refetch();
        props.updateVualts();
        setUserInput("0");
        fetchWalletBalance(dispatch, network, selectedAddress, rewardsToken);
      }, () => { }, dispatch, `Claimed ${millify(Number(fromWei(pendingReward)))} HATS`);
    setInTransaction(false);
  }

  const depositWithdrawWrapperClass = classNames({
    "deposit-wrapper": true,
    "in-withdraw": !isDeposit,
    "disabled": inTransaction
  })

  return <div className={depositWithdrawWrapperClass}>
    <div className="tabs-wrapper">
      <button className="tab deposit" onClick={() => { setIsDeposit(true); setUserInput("0"); }}>DEPOSIT</button>
      <button className="tab withdraw" onClick={() => { setIsDeposit(false); setUserInput("0"); }}>WITHDRAW</button>
    </div>
    <div className="balance-wrapper">
      {!tokenBalance ? <div style={{ position: "relative", minWidth: "50px" }}><Loading /></div> : <span>{`${tokenSymbol} Balance: ${numberWithCommas(Number(tokenBalance))}`}</span>}
    </div>
    <div>
      <div className={!isApproved ? "amount-wrapper disabled" : "amount-wrapper"}>
        <div className="top">
          <span>Pool token</span>
          <span>&#8776; $0.00</span>
        </div>
        <div className="input-wrapper">
          <div className="pool-token"><Logo width="30" /> <span>{name}</span></div>
          <input type="number" value={userInput} onChange={(e) => { isDigitsOnly(e.target.value) && setUserInput(e.target.value) }} min="0" />
        </div>
        {isDeposit && notEnoughBalance && <span className="input-error">Insufficient funds</span>}
        {!isDeposit && !canWithdraw && <span className="input-error">Can't withdraw more than staked</span>}
      </div>
    </div>
    <div>
      <button disabled={!isApproved} className="percentage-btn" onClick={() => setUserInput(String((25 / 100) * parseInt(percentageValue)))}>25%</button>
      <button disabled={!isApproved} className="percentage-btn" onClick={() => setUserInput(String((50 / 100) * parseInt(percentageValue)))}>50%</button>
      <button disabled={!isApproved} className="percentage-btn" onClick={() => setUserInput(String((75 / 100) * parseInt(percentageValue)))}>75%</button>
      <button disabled={!isApproved} className="percentage-btn" onClick={() => setUserInput(percentageValue)}>100%</button>
    </div>
    <div className="staked-wrapper">
      <span>You staked</span>
      <div style={{ position: "relative" }}>{loading ? <Loading /> : <span>{numberWithCommas(Number(fromWei(stakedAmount)))}</span>}</div>
    </div>
    <div className="earnings-wrapper">
      <span>Monthly earnings &nbsp;
        <Tooltip
          overlay="Estimated monthly earnings based on total staked amount and rate reward"
          overlayClassName="tooltip"
          overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
          placement="top">
          <span><InfoIcon /></span>
        </Tooltip>
      </span>
      <span>0 Hats</span>
      <span>$???</span>
    </div>
    <div className="earnings-wrapper">
      <span>Yearly earnings &nbsp;
        <Tooltip
          overlay="Estimated yearly earnings based on total staked amount and rate reward"
          overlayClassName="tooltip"
          overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
          placement="top">
          <span><InfoIcon /></span>
        </Tooltip>
      </span>
      <span>0 Hats</span>
      <span>$???</span>
    </div>
    <div className="action-btn-wrapper">
      {!isApproved && <button
        className="action-btn"
        onClick={async () => await approveToken()}>{`ENABLE SPENDING ${tokenSymbol}`}</button>}
      {isApproved && isDeposit && <button
        disabled={notEnoughBalance || !userInput || userInput === "0"}
        className="action-btn"
        onClick={async () => await deposit()}>DEPOSIT</button>}
      {isApproved && !isDeposit && <button
        disabled={!canWithdraw || !userInput || userInput === "0"}
        className="action-btn"
        onClick={async () => await withdraw()}>WITHDRAW AND CLAIM</button>}
    </div>
    <div className="alt-actions-wrapper">
      <button onClick={async () => await claim()} disabled={!isApproved || pendingReward.eq(0)} className="alt-action-btn">{`CLAIM ${millify(Number(fromWei(pendingReward)))} HATS`}</button>
    </div>
    {inTransaction && <Loading />}
  </div>
}
