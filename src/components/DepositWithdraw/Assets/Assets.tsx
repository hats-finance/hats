import InfoIcon from "assets/icons/info.icon";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE, ScreenSize } from "constants/constants";
import Tooltip from "rc-tooltip";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { IVault } from "types/types";
import { DepositAmount } from "./DepositAmount";
import WithdrawTimer from "../WithdrawTimer/WithdrawTimer";
import { useVaultsApy } from "components/Vault/hooks/useVaultsApy";
import "./index.scss";

interface IProps {
  vault: IVault
}

export default function Assets({ vault }: IProps) {
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { apys } = useVaultsApy(vault.multipleVaults ?? [vault]);

  const additionalTokens = vault.multipleVaults ? vault.multipleVaults.map((vault, index) => {
    return (
      <tr key={index}>
        <td className="token-symbol">{vault.stakingTokenSymbol}</td>
        <td className="withdraw-status-data"><WithdrawTimer vault={vault} /></td>
        <td><DepositAmount vault={vault} /></td>
        <td>{apys[vault.stakingToken]}</td>
      </tr>
    )
  }) : (
    <tr>
      <td className="token-symbol">{vault.stakingTokenSymbol}</td>
      <td className="withdraw-status-data"><WithdrawTimer vault={vault} /></td>
      <td><DepositAmount vault={vault} /></td>
      <td>{apys[vault.stakingToken]}</td>
    </tr>
  )

  return (
    <table className="assets-table">
      <thead>
        <tr>
          <th>Assets</th>
          <th className="withdraw-status-column">Withdraw {screenSize === ScreenSize.Desktop && "Status"}</th>
          <th>Deposited</th>
          <th className="apy-column">
            <span>APY</span>
            <Tooltip
              overlayClassName="tooltip"
              overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
              overlay="Estimated yearly earnings based on total staked amount and rate reward">
              <div className="info-icon"><InfoIcon fill={Colors.white} /></div>
            </Tooltip>
          </th>
        </tr>
      </thead>
      <tbody>
        {additionalTokens}
      </tbody>
    </table>
  )
}
