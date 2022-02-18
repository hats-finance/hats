import { useState } from "react";
import "../../styles/Vault/Vault.scss";
import { IVault } from "../../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { formatWei, fromWei } from "../../utils";
import ArrowIcon from "../../assets/icons/arrow.icon";
import { RootState } from "../../reducers";
import { ScreenSize } from "../../constants/constants";
import VaultExpanded from "./VaultExpanded";
import VaultAction from "./VaultAction";

interface IProps {
  data: IVault,
  setShowModal: (show: boolean) => any,
  setModalData: (data: any) => any
}

export default function Vault(props: IProps) {
  const [toggleRow, setToggleRow] = useState(false);
  const { name, isGuest, bounty, description } = props.data;
  const { totalRewardAmount, honeyPotBalance, withdrawRequests, stakingTokenDecimals, tokenPrice, apy } = props.data.parentVault;
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  const vaultAPY = apy ? `${millify(apy, { precision: 3 })}%` : "-"
  const honeyPotBalanceValue = millify(Number(fromWei(honeyPotBalance, stakingTokenDecimals)) * tokenPrice);
  const vaultExpand = <div className={toggleRow ? "arrow open" : "arrow"} onClick={() => setToggleRow(!toggleRow)}><ArrowIcon /></div>;

  const maxRewards = (
    <>
      <div className="max-rewards-wrapper">
        {formatWei(honeyPotBalance, 3, stakingTokenDecimals)}
        {honeyPotBalanceValue && <span className="honeypot-balance-value">&nbsp;{`≈ $${honeyPotBalanceValue}`}</span>}
      </div>
      {screenSize === ScreenSize.Mobile && <span className="sub-label">Total vault</span>}
    </>
  )

  return (
    <>
      <tr className={isGuest ? "guest" : ""}>
        {screenSize === ScreenSize.Desktop && <td>{vaultExpand}</td>}
        <td>
          <div className="project-name-wrapper">
            {/* TODO: handle project-metadata and Project-metadata */}
            <img src={description?.["project-metadata"]?.icon ?? description?.["Project-metadata"]?.icon} alt="project logo" />
            <div className="name-source-wrapper">
              <div className="project-name">{name}</div>
              {isGuest && <a className="source-name" target="_blank" rel="noopener noreferrer" href={description?.source?.url}>By {description?.source?.name}</a>}
              {screenSize === ScreenSize.Mobile && maxRewards}
            </div>
          </div>
        </td>

        {screenSize === ScreenSize.Desktop && (
          <>
            <td className="rewards-cell">
              {isGuest && `${bounty} bounty + `}
              {maxRewards}
            </td>
            <td>{millify(Number(fromWei(totalRewardAmount, stakingTokenDecimals)))}</td>
            <td>{vaultAPY}</td>
            <td>
              <VaultAction
                data={props.data}
                withdrawRequests={withdrawRequests}
                setShowModal={props.setShowModal}
                setModalData={props.setModalData} />
            </td>
          </>
        )}
        {screenSize === ScreenSize.Mobile && <td>{vaultExpand}</td>}
      </tr>
      {toggleRow &&
        <VaultExpanded
          data={props.data}
          withdrawRequests={withdrawRequests}
          setShowModal={props.setShowModal}
          setModalData={props.setModalData} />}
    </>
  )
}
