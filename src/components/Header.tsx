import { useEffect, useState } from "react";
import { toggleInTransaction, toggleMenu } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import {
  getMainPath,
} from "../utils";
import "../styles/Header.scss";
import "../styles/global.scss";
import { NotificationType, ScreenSize } from "../constants/constants";
import { useLocation } from "react-router-dom";
import { Pages } from "../constants/constants";
import Modal from "./Shared/Modal";
import HatsBreakdown from "./HatsBreakdown";
import { CHAINID } from "../settings";
import MenuIcon from "../assets/icons/hamburger.icon";
import CloseIcon from "../assets/icons/close.icon";
import Logo from "../assets/icons/logo.icon";
import { RootState } from "../reducers";
import WalletInfo from "./WalletInfo/WalletInfo";
import WalletButton from "./WalletButton/WalletButton";
import millify from "millify";
import { useEthers, useNotifications } from "@usedapp/core";
import { useNotification } from "hooks/useNotification";

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const screenSize = useSelector(
    (state: RootState) => state.layoutReducer.screenSize
  );
  const [showModal, setShowModal] = useState(false);
  const showMenu = useSelector(
    (state: RootState) => state.layoutReducer.showMenu
  );
  const { hatsBalance } = useSelector((state: RootState) => state.web3Reducer);
  const inTransaction = useSelector(
    (state: RootState) => state.layoutReducer.inTransaction
  );

  const { chainId, account } = useEthers();
  const { notifications } = useNotifications();
  const { toggleNotification } = useNotification();

  // const { transactions } = useTransactions();
  // useEffect(() => {
  //   console.log("transactions", transactions);
  // }, [transactions])

  useEffect(() => {
    //console.log("notifications", notifications);
    if (notifications.length > 0) {
      const notification = notifications[0];
      let type;
      let text;
      // if (notification.type === "transactionStarted") {

      // }
      switch (notification.type) {
        case "transactionFailed":
          type = NotificationType.Error;
          text = "Transaction Failed";
          break;
        case "transactionSucceed":
          type = NotificationType.Success;
          text = "Transaction Succeed";
          break;
      }
      toggleNotification(true, type, text);
    } else {
      setTimeout(() => {
        //toggleNotification(false, undefined, "");
        dispatch(toggleInTransaction(false));
      }, 3000);
    }
  }, [notifications, dispatch, toggleNotification])

  return (
    <header data-testid="Header">
      {screenSize === ScreenSize.Desktop && (
        <div className="page-title">
          {Pages[getMainPath(location.pathname)]}
        </div>
      )}
      <button
        disabled={chainId !== CHAINID}
        className="hats-btn"
        onClick={() => setShowModal(true)}
      >
        <Logo width="30" height="30" />
        <span>{hatsBalance ? `${millify(hatsBalance)}` : "-"}</span>
      </button>

      {account && <WalletInfo />}
      {(screenSize === ScreenSize.Desktop ||
        (screenSize === ScreenSize.Mobile && !inTransaction)) && (
          <WalletButton />
        )}

      {screenSize === ScreenSize.Mobile && (
        <div onClick={() => dispatch(toggleMenu(!showMenu))}>
          {showMenu ? <CloseIcon /> : <MenuIcon />}
        </div>
      )}
      {showModal && (
        <Modal
          title="YOUR HATS BREAKDOWN"
          setShowModal={setShowModal}
          height="fit-content"
        >
          <HatsBreakdown />
        </Modal>
      )}
    </header>
  );
}
