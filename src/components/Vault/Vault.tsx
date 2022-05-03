import { useState, useEffect } from "react";
import "../../styles/Vault/Vault.scss";
import { t } from "i18next";
import { IVault } from "../../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { formatWei, fromWei, ipfsTransformUri } from "../../utils";
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
  const [toggleRow, setToggleRow] = useState<boolean>(props.preview ? true : false);
  const { name, isGuest, bounty, id, description } = props.data;
  const tokenPrice = useSelector((state: RootState) => state.dataReducer.vaults.filter((vault: IVault) => vault.id === id)[0]?.parentVault?.tokenPrice);
  const apy = useSelector((state: RootState) => state.dataReducer.vaults.filter((vault: IVault) => vault.id === id)[0]?.parentVault?.apy);
  const { totalRewardAmount, honeyPotBalance, withdrawRequests, stakingTokenDecimals } = props.data.parentVault;
  const [vaultAPY, setVaultAPY] = useState("-");
  const [honeyPotBalanceValue, setHoneyPotBalanceValue] = useState("");
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  useEffect(() => {
    setVaultAPY(apy ? `${millify(apy, { precision: 3 })}%` : "-");
  }, [setVaultAPY, apy])

  // temporary fix to https://github.com/hats-finance/hats/issues/29
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (apy) {
  //       setVaultAPY(`${millify(apy, { precision: 3 })}%`);
  //     }
  //   }, 1000);
  // }, [setVaultAPY, apy])

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
      <tr className={isGuest ? "guest" : description?.["project-metadata"]?.gamification ? "gamification" : ""}>
        {screenSize === ScreenSize.Desktop && <td>{vaultExpand}</td>}
        <td>
          <div className="project-name-wrapper">
            {/* TODO: handle project-metadata and Project-metadata */}
            <img src={ipfsTransformUri(description?.["project-metadata"]?.icon ?? description?.["Project-metadata"]?.icon)} alt="project logo" />
            <div className="name-source-wrapper">
              <div className="project-name">{props.preview ? description["project-metadata"].name : name}</div>
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
