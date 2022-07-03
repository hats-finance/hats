import { useTranslation } from "react-i18next";
import InfoIcon from "assets/icons/info.icon";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE, ScreenSize } from "constants/constants";
import Tooltip from "rc-tooltip";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { IVault } from "types/types";
import { DepositAmount } from "./DepositAmount";
import WithdrawTimer from "../WithdrawTimer/WithdrawTimer";
import { useVaultsApy } from "components/Vault/hooks/useVaultsApy";
import { formatAPY } from "utils";
import "./index.scss";

interface IProps {
  vault: IVault
}

export default function Assets({ vault }: IProps) {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { apys } = useVaultsApy(vault.multipleVaults ?? [vault]);

  const additionalTokens = vault.multipleVaults ? vault.multipleVaults.map((vault, index) => {
    return (
      <tr key={index}>
        <td className="token-symbol">{vault.stakingTokenSymbol}</td>
        <td className="withdraw-status-data">
          <WithdrawTimer vault={vault} plainTextView placeHolder="-" />
        </td>
        <td><DepositAmount vault={vault} /></td>
        <td>{formatAPY(apys[vault.stakingToken].apy)}</td>
      </tr>
    )
  }) : (
    <tr>
      <td className="token-symbol">{vault.stakingTokenSymbol}</td>
      <td className="withdraw-status-data">
        <WithdrawTimer vault={vault} plainTextView placeHolder="-" />
      </td>
      <td><DepositAmount vault={vault} /></td>
      <td>{formatAPY(apys[vault.stakingToken].apy)}</td>
    </tr>
  )

  return (
    <table className="assets-table">
      <thead>
        <tr>
          <th>{t("DepositWithdraw.Assets.assets")}</th>
          <th className="withdraw-status-column">
            {t("DepositWithdraw.Assets.withdraw")}
            {screenSize === ScreenSize.Desktop && <span>&nbsp;{t("DepositWithdraw.Assets.status")}</span>}
          </th>
          <th>{t("DepositWithdraw.Assets.deposited")}</th>
          <th>
            <div className="apy-column">
              <span>APY</span>
              <Tooltip
                overlayClassName="tooltip"
                overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
                overlay={t("Shared.apy-explain")}>
                <div className="info-icon"><InfoIcon fill={Colors.white} /></div>
              </Tooltip>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {additionalTokens}
      </tbody>
    </table>
  )
}
