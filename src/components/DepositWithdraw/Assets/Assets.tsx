import { useQuery } from "@apollo/client";
import { useEthers } from "@usedapp/core";
import InfoIcon from "assets/icons/info.icon";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { getStakerData } from "graphql/subgraph";
import Tooltip from "rc-tooltip";
import { IAdditionalVaults } from "types/types";
import "./index.scss";

interface IProps {
  stakingTokenSymbol: string;
  additionalVaults: IAdditionalVaults[];
}

export default function Assets({ stakingTokenSymbol, additionalVaults }: IProps) {
  const { account } = useEthers();
  //const { data: staker } = useQuery(getStakerData(id, account!));

  const additionalTokens = additionalVaults.map(vault => {
    return (
      <tr>
        <td>{vault.tokenSymbol}</td>
        <td>DEPOSITED</td>
        <td>APY</td>
      </tr>)
  })

  return (
    <table className="assets-table">
      <tr>
        <th className="assets-column">Assets</th>
        <th>Staked</th>
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
      <tr>
        <td>{stakingTokenSymbol}</td>
        <td></td>
        <td></td>
      </tr>
      {additionalTokens}
    </table>
  )
}
