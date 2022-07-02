import { IVault } from "../../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { formatApy, fromWei, ipfsTransformUri } from "../../utils";
import ArrowIcon from "../../assets/icons/arrow.icon";
import { RootState } from "../../reducers";
import { ScreenSize } from "../../constants/constants";
import VaultExpanded from "./VaultExpanded";
import VaultAction from "./VaultAction";
import { useTranslation } from "react-i18next";
import TokensSymbols from "./TokensSymbols/TokensSymbols";
import { ForwardedRef, forwardRef } from "react";
import { useVaultsTotalPrices } from "./hooks/useVaultsTotalPrices";
import { useVaultsApy } from "./hooks/useVaultsApy";
import MultiTokensAPY from "./MultiTokensAPY/MultiTokensAPY";
import "../../styles/Vault/Vault.scss";

interface IProps {
  data: IVault,
  expanded: boolean,
  setExpanded?: any,
  preview?: boolean,
}

const Vault = forwardRef((props: IProps, ref: ForwardedRef<HTMLTableRowElement>) => {
  const { t } = useTranslation();
  const { description, honeyPotBalance, withdrawRequests, stakingTokenDecimals, stakingToken, multipleVaults } = props.data;
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const honeyPotBalanceValue = millify(Number(fromWei(honeyPotBalance, stakingTokenDecimals)));
  const { totalPrices } = useVaultsTotalPrices(multipleVaults ?? [props.data]);
  const sumTotalPrices = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);
  const { apys } = useVaultsApy(props.data.multipleVaults ?? [props.data]);

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
            <td>{props.data.multipleVaults ? <MultiTokensAPY apys={apys} /> : formatApy(apys[stakingToken])}</td>
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
