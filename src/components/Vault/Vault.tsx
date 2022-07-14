import { IVault } from "../../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { formatUnits } from "ethers/lib/utils";
import { ipfsTransformUri } from "../../utils";
import ArrowIcon from "../../assets/icons/arrow.icon";
import { RootState } from "../../reducers";
import { ScreenSize } from "../../constants/constants";
import VaultExpanded from "./VaultExpanded";
import VaultAction from "./VaultAction";
import { useTranslation } from "react-i18next";
import TokensSymbols from "./TokensSymbols/TokensSymbols";
import { ForwardedRef, forwardRef } from "react";
import { useVaultsTotalPrices } from "./hooks/useVaultsTotalPrices";
import VaultAPY from "./VaultAPY/VaultAPY";
import "../../styles/Vault/Vault.scss";

interface IProps {
  data: IVault,
  expanded: boolean,
  setExpanded?: any,
  preview?: boolean,
}

const Vault = forwardRef((props: IProps, ref: ForwardedRef<HTMLTableRowElement>) => {
  const { t } = useTranslation();
  const { description, honeyPotBalance, withdrawRequests, stakingTokenDecimals, multipleVaults } = props.data;
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const honeyPotBalanceValue = millify(Number(formatUnits(honeyPotBalance, stakingTokenDecimals)));
  const { totalPrices } = useVaultsTotalPrices(multipleVaults ?? [props.data]);
  const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);

  const vaultExpand = (
    <div
      className={props.expanded ? "arrow open" : "arrow"}
      onClick={() => {
        if (props.setExpanded) {
          props.setExpanded(props.expanded ? null : props.data)
        }
      }}>
      <ArrowIcon />
    </div>
  );

  const maxRewards = (
    <>
      <div className="max-rewards-wrapper">
        {!multipleVaults && honeyPotBalanceValue}
        <span className="honeypot-balance-value">&nbsp;{`≈ $${millify(sumTotalPrices)}`}</span>
      </div>
      {screenSize === ScreenSize.Mobile && <span className="sub-label">{t("Vault.total-vault")}</span>}
    </>
  )

  return (
    <>
      <tr ref={ref} className={description?.["project-metadata"]?.type}>
        {screenSize === ScreenSize.Desktop && <td>{vaultExpand}</td>}
        <td>
          <div className="project-name-wrapper">
            <img src={ipfsTransformUri(description?.["project-metadata"]?.icon ?? "")} alt="project logo" />
            <div className="name-source-wrapper">
              <div className="project-name">
                {description?.["project-metadata"].name}
                <TokensSymbols vault={props.data} />
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
            <td>
              <VaultAPY vault={props.data} />
            </td>
            <td>
              <VaultAction
                data={props.data}
                withdrawRequests={withdrawRequests}
                preview={props.preview} />
            </td>
          </>
        )}
        {screenSize === ScreenSize.Mobile && <td>{vaultExpand}</td>}
      </tr>
      {props.expanded &&
        <VaultExpanded
          data={props.data}
          withdrawRequests={withdrawRequests}
          preview={props.preview} />}
    </>
  )
});

export default Vault;
