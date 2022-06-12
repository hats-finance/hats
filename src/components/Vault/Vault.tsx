import { useState, useEffect } from "react";
import { IVault } from "../../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { calculateApy, fromWei, ipfsTransformUri } from "../../utils";
import ArrowIcon from "../../assets/icons/arrow.icon";
import { RootState } from "../../reducers";
import { ScreenSize } from "../../constants/constants";
import VaultExpanded from "./VaultExpanded";
import VaultAction from "./VaultAction";
import { useTranslation } from "react-i18next";
import "../../styles/Vault/Vault.scss";

interface IProps {
  data: IVault,
  setShowModal?: (show: boolean) => any,
  setModalData?: (data: any) => any,
  preview?: boolean,
}

export default function Vault(props: IProps) {
  const { t } = useTranslation();
  const { description, tokenPrice, honeyPotBalance,
    withdrawRequests, stakingTokenDecimals, stakingTokenSymbol } = props.data;
  const [toggleRow, setToggleRow] = useState<boolean>(props.preview ? true : false);
  const hatsPrice = useSelector((state: RootState) => state.dataReducer.hatsPrice);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  const apy = hatsPrice ? calculateApy(props.data, hatsPrice, tokenPrice) : 0;
  const vaultApy = apy ? `${millify(apy, { precision: 3 })}%` : "-";

  const honeyPotBalanceValue = tokenPrice ? millify(Number(fromWei(honeyPotBalance, stakingTokenDecimals)) * tokenPrice) : "-";
  const vaultExpand = <div className={toggleRow ? "arrow open" : "arrow"} onClick={() => setToggleRow(!toggleRow)}><ArrowIcon /></div>;

  const maxRewards = (
    <>
      <div className="max-rewards-wrapper">
        {honeyPotBalanceValue && <span className="honeypot-balance-value">&nbsp;{`≈ $${honeyPotBalanceValue}`}</span>}
      </div>
      {screenSize === ScreenSize.Mobile && <span className="sub-label">{t("Vault.total-vault")}</span>}
    </>
  )

  return (
    <>
      <tr className={description?.["project-metadata"]?.gamification ? "gamification" : ""}>
        {screenSize === ScreenSize.Desktop && <td>{vaultExpand}</td>}
        <td>
          <div className="project-name-wrapper">
            <img src={ipfsTransformUri(description?.["project-metadata"]?.icon ?? "")} alt="project logo" />
            <div className="name-source-wrapper">
              <div className="project-name">
                {description?.["project-metadata"].name}
                <div className="token-symbol">{stakingTokenSymbol}</div>
              </div>
              {screenSize === ScreenSize.Mobile && maxRewards}
            </div>
          </div>
        </td>

        {screenSize === ScreenSize.Desktop && (
          <>
            <td className="rewards-cell">
              {maxRewards}
            </td>
            <td>{vaultApy}</td>
            <td>
              <VaultAction
                data={props.data}
                withdrawRequests={withdrawRequests}
                setShowModal={props.setShowModal}
                setModalData={props.setModalData}
                preview={props.preview} />
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
          setModalData={props.setModalData}
          preview={props.preview} />}
    </>
  )
}
