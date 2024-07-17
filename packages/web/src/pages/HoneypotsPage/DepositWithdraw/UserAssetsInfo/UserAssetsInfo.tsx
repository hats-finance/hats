import InfoIcon from "assets/icons/info.icon";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import Tooltip from "rc-tooltip";
import { useTranslation } from "react-i18next";
import { IVault } from "types";
import { WithdrawTimer } from "..";
import { useVaultDepositWithdrawInfo } from "../useVaultDepositWithdrawInfo";
import { StyledUserAssetsInfoTable } from "./styles";

interface IProps {
  vault: IVault;
}

const VaultAssetInfo = ({ vault }: IProps) => {
  const { availableBalanceToWithdraw } = useVaultDepositWithdrawInfo(vault);

  return (
    <tr>
      <td className="token-symbol">{availableBalanceToWithdraw.symbol}</td>
      <td className="withdraw-status-data">
        <WithdrawTimer vault={vault} plainTextView placeHolder="-" />
      </td>
      <td>{availableBalanceToWithdraw.formattedWithoutSymbol()}</td>
      <td>-</td>
    </tr>
  );
};

export default function UserAssetsInfo({ vault }: IProps) {
  const { t } = useTranslation();

  const vaults = vault.multipleVaults ? vault.multipleVaults : [vault];

  const listOfTokens = vaults.map((vault) => <VaultAssetInfo key={vault.id} vault={vault} />);

  return (
    <StyledUserAssetsInfoTable>
      <thead>
        <tr>
          <th>
            {t("assets")} {`(${vaults.length})`}
          </th>
          <th className="withdraw-status-column">{t("withdrawStatus")}</th>
          <th>{t("balance")}</th>
          <th>
            <div className="apy-column">
              <span>APY</span>
              <Tooltip
                overlayClassName="tooltip"
                overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE as any}
                overlay={t("Shared.apy-explain")}
              >
                <div className="info-icon">
                  <InfoIcon fill={Colors.white} />
                </div>
              </Tooltip>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>{listOfTokens}</tbody>
    </StyledUserAssetsInfoTable>
  );
}
