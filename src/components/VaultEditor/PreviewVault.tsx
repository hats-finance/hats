import { useState, useEffect } from "react";
import { t } from "i18next";
import { IVault } from "../../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { formatWei, fromWei } from "../../utils";
import ArrowIcon from "../../assets/icons/arrow.icon";
import { RootState } from "../../reducers";
import { ScreenSize } from "../../constants/constants";
import VaultExpanded from "./VaultExpanded";
import VaultAction from "./VaultAction";
import "./PreviewVault.scss";

interface IProps {
  data: IVault
}

export default function Vault(props: IProps) {
  const [toggleRow, setToggleRow] = useState(false);
  const { description } = props.data;
  const { totalRewardAmount, honeyPotBalance, stakingTokenDecimals, tokenPrice, apy } = props.data.parentVault;
  const [vaultAPY, setVaultAPY] = useState("-");
  const [honeyPotBalanceValue, setHoneyPotBalanceValue] = useState("");
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  useEffect(() => {
    setVaultAPY(apy ? `${millify(apy, { precision: 3 })}%` : "-");
  }, [setVaultAPY, apy])

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
      {screenSize === ScreenSize.Mobile && <span className="sub-label">
        {t("VaultEditor.review-vault.total-vault")}
      </span>}
    </>
  )

  return (
    <div className="preview-vault honeypots-wrapper">
      <table>
        <tbody>
          <tr>
            {screenSize === ScreenSize.Desktop && <td>{vaultExpand}</td>}
            <td>
              <div className="project-name-wrapper">
                <img src={description["project-metadata"].icon} alt="project logo" />
                <div className="name-source-wrapper">
                  <div className="project-name">{description["project-metadata"].name}</div>
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
                <td>{vaultAPY}</td>
                <td>
                  <VaultAction />
                </td>
              </>
            )}
            {screenSize === ScreenSize.Mobile && <td>{vaultExpand}</td>}
          </tr>
          {toggleRow && <VaultExpanded data={props.data} />}
        </tbody>
      </table>
    </div>
  )
}
