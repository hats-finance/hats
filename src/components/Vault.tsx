import React, { useState } from "react";
import "../styles/Vault.scss";
import { IVault } from "../types/types";
import { useSelector } from "react-redux"; // useDispatch
//import moment from "moment";
import millify from "millify";
import { fromWei } from "../utils"; // numberWithCommas
import ArrowIcon from "../assets/icons/arrow.icon";

interface IProps {
  data: IVault,
  setShowModal: (show: boolean) => any,
  setModalData: (data: any) => any
}

export default function Vault(props: IProps) {
  const [toggleRow, setToggleRow] = useState(false);
  //const dispatch = useDispatch();
  const provider = useSelector(state => (state as any).web3Reducer.provider);
  //const { name, honeypot, vulnerabilities, funds, apy, submitted, complexity } = props.data;
  const { name, totalStaking, rewardRate } = props.data;
  //console.log(fromWei(rewardRate));
  return (
    <React.Fragment>
      <tr className="inner-row">
        <td>
          <div className={toggleRow ? "arrow open" : "arrow"} onClick={() => setToggleRow(!toggleRow)}><ArrowIcon /></div>
        </td>
        <td>{name}</td>
        <td>{millify(Number(fromWei(totalStaking)))}</td>
        <td>???</td>
        <td>???</td>
        <td>{`${millify(Number(fromWei(rewardRate)))}%`}</td>
        <td>
          <button
            className="action-btn"
            onClick={() => { props.setShowModal(true); props.setModalData(props.data) }}
            disabled={!provider}>
            DEPOSITE / WITHDRAW
          </button>
        </td>
      </tr>
      {
        toggleRow &&
        <tr>
          <td className="sub-cell" colSpan={7}>{`Vulnerabilities Submitted: ???`}</td>
        </tr>
      }
    </React.Fragment>
  )
}
