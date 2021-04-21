import React, { useState } from "react";
import "../styles/Vault.scss";
import { IVault } from "../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { fromWei, isProviderAndNetwork, numberWithCommas } from "../utils";
import ArrowIcon from "../assets/icons/arrow.icon";
import { RootState } from "../reducers";

interface IProps {
  data: IVault,
  setShowModal: (show: boolean) => any,
  setModalData: (data: any) => any
}

export default function Vault(props: IProps) {
  const [toggleRow, setToggleRow] = useState(false);
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const { name, totalStaking, numberOfApprovedClaims, apy, totalRewardAmount } = props.data;
  // <td className="sub-cell" colSpan={7}>{`Vulnerabilities Submitted: ${numberWithCommas(Number(master.numberOfSubmittedClaims))}`}</td>
  return (
    <React.Fragment>
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
            <div>Committee</div>
            <div>Contracts</div>
          </td>
        </tr>
      }
    </React.Fragment>
  )
}
