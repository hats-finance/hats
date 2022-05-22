import { useState, useEffect } from "react";
import "../../styles/Vault/Vault.scss";
import { t } from "i18next";
import { IVault } from "../../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { calculateApy, formatWei, fromWei, ipfsTransformUri } from "../../utils";
import ArrowIcon from "../../assets/icons/arrow.icon";
import { RootState } from "../../reducers";
import { ScreenSize } from "../../constants/constants";
import VaultExpanded from "./VaultExpanded";
import VaultAction from "./VaultAction";

interface IProps {
  data: IVault,
  setShowModal?: (show: boolean) => any,
  setModalData?: (data: any) => any,
  preview?: boolean,
}

export default function Vault(props: IProps) {
  const { description, tokenPrice, totalRewardAmount, honeyPotBalance,
    withdrawRequests, stakingTokenDecimals } = props.data;
  const [toggleRow, setToggleRow] = useState<boolean>(props.preview ? true : false);
  const [honeyPotBalanceValue, setHoneyPotBalanceValue] = useState("");
  const hatsPrice = useSelector((state: RootState) => state.dataReducer.hatsPrice);
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  const apy = hatsPrice ? calculateApy(props.data, hatsPrice, tokenPrice) : 0;
  const vaultApy = apy ? `${millify(apy, { precision: 3 })}%` : "-";

  useEffect(() => {
    setHoneyPotBalanceValue(tokenPrice ? millify(Number(fromWei(honeyPotBalance, stakingTokenDecimals)) * tokenPrice) : "0");
  }, [tokenPrice, honeyPotBalance, stakingTokenDecimals])

  const vaultExpand = <div className={toggleRow ? "arrow open" : "arrow"} onClick={() => setToggleRow(!toggleRow)}><ArrowIcon /></div>;

  const maxRewards = (
    <>
      <div className="max-rewards-wrapper">
        {formatWei(honeyPotBalance, 3, stakingTokenDecimals)}
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
            {/* TODO: handle project-metadata and Project-metadata */}
            <img src={ipfsTransformUri(description?.["project-metadata"]?.icon ?? description?.["Project-metadata"]?.icon)} alt="project logo" />
            <div className="name-source-wrapper">
              <div className="project-name">{description?.["project-metadata"].name}</div>
              {screenSize === ScreenSize.Mobile && maxRewards}
            </div>
          </div>
        </td>

        {screenSize === ScreenSize.Desktop && (
          <>
            <td className="rewards-cell">
              {maxRewards}
            </td>
            <td>{millify(Number(fromWei(totalRewardAmount, stakingTokenDecimals)))}</td>
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
