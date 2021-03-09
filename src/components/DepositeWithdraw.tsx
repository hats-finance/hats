import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { fromWei, isDigitsOnly } from "../utils";
import Loading from "./Shared/Loading";
import InfoIcon from "../assets/icons/info.icon";
import "../styles/DepositeWithdraw.scss";
import * as contractsActions from "../actions/contractsActions";
import { IVault } from "../types/types";
import { getStakerAmountByVaultID } from "../graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import millify from "millify";
import { BigNumber } from "@ethersproject/bignumber";
import { useWalletBalance } from "../hooks/utils";
//import Logo from "../assets/icons/logo.icon";

interface IProps {
  data: IVault,
  updateVualts: Function
}

export default function DepositeWithdraw(props: IProps) {
  const updateWalletBalance = useWalletBalance();
  const { address, stakingToken, id } = props.data;
  const [isDeposit, setIsDeposit] = useState(true);
  const [userInput, setUserInput] = useState("0");
  const [isApproved, setIsApproved] = useState(false);
  const [inTransaction, setInTransaction] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const notEnoughBalance = parseInt(userInput) > parseInt(tokenBalance);
  const selectedAddress = useSelector(state => (state as any).web3Reducer.provider?.selectedAddress) ?? "";
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
      setIsApproved(await contractsActions.isApproved(stakingToken, selectedAddress, address));
    }
    checkIsApproved();
  }, [stakingToken, selectedAddress, address]);

  React.useEffect(() => {
    const getTokenData = async () => {
      setTokenBalance(await contractsActions.getTokenBalance(stakingToken, selectedAddress));
      setTokenSymbol(await contractsActions.getTokenSymbol(stakingToken));
    }
    getTokenData();
  }, [stakingToken, selectedAddress, inTransaction]);

  const approveToken = async () => {
    setInTransaction(true);
    await contractsActions.createTransaction(async () => contractsActions.approveToken(stakingToken, address), async () => { setIsApproved(true); }, () => { });
    setInTransaction(false);
  }

  const deposit = async () => {
    setInTransaction(true);
    await contractsActions.createTransaction(async () => contractsActions.deposit(address, userInput), async () => { refetch(); props.updateVualts(); setUserInput("0"); }, () => { });
    setInTransaction(false);
  }

  const withdraw = async () => {
    setInTransaction(true);
    await contractsActions.createTransaction(async () => contractsActions.withdraw(address, userInput), async () => { refetch(); props.updateVualts(); setUserInput("0"); }, () => { });
    setInTransaction(false);
  }

  const claim = async () => {
    setInTransaction(true);
    await contractsActions.createTransaction(async () => contractsActions.claim(address), async () => { refetch(); props.updateVualts(); setUserInput("0"); updateWalletBalance(); }, () => { });
    setInTransaction(false);
  }

  const exit = async () => {
    setInTransaction(true);
    await contractsActions.createTransaction(async () => contractsActions.exit(address), async () => { refetch(); props.updateVualts(); setUserInput("0"); updateWalletBalance(); }, () => { });
    setInTransaction(false);
  }

  return <div className={inTransaction ? "deposit-wrapper disabled" : "deposit-wrapper"}>
    <div className="tabs-wrapper">
      <button className={isDeposit ? "tab selected" : "tab"} onClick={() => { setIsDeposit(true); setUserInput("0"); }}>DEPOSIT</button>
      <button className={isDeposit ? "tab" : "tab selected"} onClick={() => { setIsDeposit(false); setUserInput("0"); }}>WITHDRAW</button>
    </div>
    <div className="balance-wrapper">
      <span>Amount</span>
      {!tokenBalance ? <div style={{ position: "relative", minWidth: "50px" }}><Loading /></div> : <span>{`${tokenSymbol} Balance: ${millify(Number(tokenBalance))}`}</span>}
    </div>
    <div>
      <div className={!isApproved ? "amount-wrapper disabled" : "amount-wrapper"}>
        <div className="top">
          <span>Pool token</span>
          <span>&#8776; $0.00</span>
        </div>
        <div className="input-wrapper">
          <span>HATS</span>
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
      <div style={{ position: "relative" }}>{loading ? <Loading /> : <span>{millify(Number(fromWei(stakedAmount)))}</span>}</div>
    </div>
    <div className="earnings-wrapper">
      <span>Monthly earnings &nbsp; <InfoIcon /></span>
      <span>0 Hats</span>
      <span>$???</span>
    </div>
    <div className="earnings-wrapper">
      <span>Yearly earnings &nbsp; <InfoIcon /></span>
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
        onClick={async () => await withdraw()}>WITHDRAW</button>}
    </div>
    <div className="alt-actions-wrapper">
      <button onClick={async () => await claim()} disabled={!isApproved} className="alt-action-btn">CLAIM</button>
      <button onClick={async () => await exit()} disabled={!isApproved} className="alt-action-btn">EXIT</button>
    </div>
    {inTransaction && <Loading />}
  </div>
}
