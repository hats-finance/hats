import InfoIcon from "assets/icons/info.icon";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import Tooltip from "rc-tooltip";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { IVault } from "types/types";
import { calculateApy } from "utils";
import { DepositAmount } from "./DepositAmount";
import WithdrawTimer from "../WithdrawTimer/WithdrawTimer";
import "./index.scss";

interface IProps {
  vault: IVault
}

export default function Assets({ vault }: IProps) {
  const { dataReducer: { hatsPrice } } = useSelector((state: RootState) => state);
  const tokenPrices = useSelector((state: RootState) => state.dataReducer.tokenPrices);

  const additionalTokens = vault.multipleVaults ? vault.multipleVaults.map((vault, index) => {
    return (
      <tr key={index}>
        <td>{vault.stakingTokenSymbol}</td>
        <td><WithdrawTimer vault={vault} /></td>
        <td><DepositAmount vault={vault} /></td>
        <td>{hatsPrice ? calculateApy(vault, hatsPrice, tokenPrices[vault.stakingToken]) : "-"}</td>
      </tr>
    )
  }) : (
    <tr>
      <td>{vault.stakingTokenSymbol}</td>
      <td><WithdrawTimer vault={vault} /></td>
      <td><DepositAmount vault={vault} /></td>
      <td>{hatsPrice ? calculateApy(vault, hatsPrice, tokenPrices[vault.stakingToken]) : "-"}</td>
    </tr>
  )

  return (
    <table className="assets-table">
      <thead>
        <tr>
          <th>Assets</th>
          <th className="withdraw-status-column">Withdraw Status</th>
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
