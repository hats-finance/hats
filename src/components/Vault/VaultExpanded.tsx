import { IVault, IVaultDescription } from "../../types/types";
import { parseJSONToObject, setVulnerabilityProject } from "../../utils";
import Members from "./Members";
import Multisig from "./Multisig";
import Severities from "./Severities";
import { useHistory } from "react-router-dom";
import { RoutePaths } from "../../constants/constants";

interface IProps {
  data: IVault
}

export default function VaultExpanded(props: IProps) {
  const { rewardsLevels, tokenPrice, honeyPotBalance, stakingTokenDecimals, id } = props.data.parentVault;
  const { name, isGuest, parentDescription } = props.data;
  const history = useHistory();

  const description: IVaultDescription = parseJSONToObject(props.data?.description as string);
  const descriptionParent: IVaultDescription = parentDescription && parseJSONToObject(parentDescription as string);

  return (
    <tr>
      <td className="sub-row" colSpan={7}>
        <div className="vault-expanded">
          <div className="vault-details-wrapper">
            <div className="sub-title">
              VAULT DETAILS
            </div>
            <div className="vault-details-content">
              <div>
                <span className="vault-expanded-subtitle">Committee Members:</span>
                <div className="twitter-avatars-wrapper">
                  <Members members={isGuest ? descriptionParent?.committee?.members : description?.committee?.members} />
                </div>
                <div className="multi-sig-wrapper">
                  <span className="vault-expanded-subtitle">Committee Address:</span>
                  <Multisig multisigAddress={isGuest ? descriptionParent?.committee?.["multisig-address"] : description?.committee?.["multisig-address"]} />
                </div>
              </div>
              <div className="submit-bulnerability-button-wrapper">
                <button onClick={() => { setVulnerabilityProject(name, id); history.push(RoutePaths.vulnerability); }}>SUBMIT VULNERABILITY</button>
              </div>
            </div>
          </div>
          <div className="severity-prizes-wrapper">
            <div className="sub-title">SEVERITY PRIZES</div>
            <div className="severity-prizes-content">
              <Severities
                severities={description?.severities}
                rewardsLevels={rewardsLevels}
                tokenPrice={tokenPrice}
                honeyPotBalance={honeyPotBalance}
                stakingTokenDecimals={stakingTokenDecimals} />
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}
