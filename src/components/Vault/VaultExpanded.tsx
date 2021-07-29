import React from "react";
import { NETWORK } from "../../settings";
import { IVaultDescription } from "../../types/types";
import { linkToEtherscan, truncatedAddress } from "../../utils";
import CopyToClipboard from "../Shared/CopyToClipboard";
import Members from "./Members";
import Severities from "./Severities";

interface IProps {
  description: IVaultDescription
  rewardsLevels: Array<string>
  tokenPrice: number
  honeyPotBalance: string
  stakingTokenDecimals: string
}

export default function VaultExpanded(props: IProps) {
  const { description, rewardsLevels, tokenPrice, honeyPotBalance, stakingTokenDecimals } = props;

  return (
    <tr>
      <td className="sub-row" colSpan={7}>
        <div className="vault-expanded">
          <div className="committee-wrapper">
            <div className="sub-title">
              COMMITTEE
            </div>
            <div className="committee-content">
              <div className="vault-expanded-subtitle">
                Members:
                <div className="twitter-avatars-wrapper">
                  <Members members={description?.committee.members} />
                </div>
              </div>
              <div className="multi-sig-wrapper">
                <span className="vault-expanded-subtitle">Multi sig:</span>
                <div className="multi-sig-address-wrapper">
                  <a target="_blank"
                    rel="noopener noreferrer"
                    href={linkToEtherscan(description?.committee?.["multisig-address"], NETWORK)}
                    className="multi-sig-address">
                    {truncatedAddress(description?.committee?.["multisig-address"] ?? "")}
                  </a>
                  <CopyToClipboard value={description?.committee?.["multisig-address"]} />
                </div>
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
