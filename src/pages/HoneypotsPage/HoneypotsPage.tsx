import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatUnits } from "ethers/lib/utils";
import { IVault } from "types";
import { useVaults } from "hooks/vaults/useVaults";
import { ipfsTransformUri } from "utils";
import { RoutePaths } from "navigation";
import SearchIcon from "assets/icons/search.icon";
import { Loading, Vault, Modal } from "components";
import { DepositWithdraw } from "./DepositWithdraw";
import { SafePeriodBar } from "components";
import { StyledHoneypotsPage } from "./styles";

interface HoneypotsPageProps {
  showDeposit?: boolean;
}

const HoneypotsPage = ({ showDeposit = false }: HoneypotsPageProps) => {
  const { vaults, tokenPrices } = useVaults();
  const [expanded, setExpanded] = useState();
  const [userSearch, setUserSearch] = useState("");
  const { vaultId } = useParams();
  const selectedVault = vaultId ? vaults?.find((v) => v.id === vaultId) : undefined;
  const navigate = useNavigate();

  const vaultValue = useCallback(
    (vault: IVault) => {
      const { honeyPotBalance, stakingTokenDecimals } = vault;
      const tokenPrice = tokenPrices?.[vault.stakingToken];
      return tokenPrice ? Number(formatUnits(honeyPotBalance, stakingTokenDecimals)) * tokenPrice : 0;
    },
    [tokenPrices]
  );

  const closeDeposit = () => navigate(`${RoutePaths.vaults}`);

  const scrollRef = (element) => {
    if (element) element.scrollIntoView();
  };

  const sortedVaults = vaults?.sort((a: IVault, b: IVault) => vaultValue(b) - vaultValue(a));
  const vaultsMatchSearch = sortedVaults?.filter((vault) =>
    vault.description?.["project-metadata"].name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const normalVaultKey: string = "";

  const vaultsByGroup = vaultsMatchSearch?.reduce((groups, vault) => {
    if (vault.registered) {
      const key = vault.description?.["project-metadata"].type || normalVaultKey;
      (groups[key] = groups[key] || []).push(vault);
    }
    return groups;
  }, [] as IVault[][])!;

  function capitalizeFirstLetter(val: string) {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }

  return (
    <StyledHoneypotsPage className="content-wrapper">
      {vaults === undefined ? (
        <Loading fixed />
      ) : (
        <table>
          <tbody>
            <SafePeriodBar />
            <tr>
              <th colSpan={2} className="search-cell">
                <div className="search-wrapper">
                  <SearchIcon />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="search-input"
                    placeholder="Search vault..."
                  />
                </div>
              </th>
              <th className="onlyDesktop">TOTAL VAULT</th>
              <th className="onlyDesktop">APY</th>
              <th className="onlyDesktop"></th>
            </tr>
            {/* Bounty vaults should be last - we assume bounty vaults type is "" */}
            {vaultsByGroup &&
              Object.entries(vaultsByGroup)
                .sort()
                .reverse()
                .map(([type, groupVaults]) => (
                  <React.Fragment key={type}>
                    <tr className="transparent-row">
                      <td colSpan={7}>{type === normalVaultKey ? "Bounty" : capitalizeFirstLetter(type)} Vaults</td>
                    </tr>
                    {groupVaults &&
                      groupVaults.map((vault) => (
                        <Vault
                          ref={vault.id === vaultId ? scrollRef : null}
                          expanded={expanded === vault.id}
                          setExpanded={setExpanded}
                          key={vault.id}
                          vault={vault}
                        />
                      ))}
                  </React.Fragment>
                ))}
          </tbody>
        </table>
      )}

      {selectedVault && (
        <Modal
          isShowing={showDeposit}
          title={`${selectedVault.description?.["project-metadata"].name!} ${selectedVault.version === "v2" ? "(v2)" : ""}`}
          titleIcon={ipfsTransformUri(selectedVault.description?.["project-metadata"].icon!)}
          onHide={closeDeposit}
          removeHorizontalPadding>
          <DepositWithdraw vault={selectedVault} closeModal={closeDeposit} />
        </Modal>
      )}
    </StyledHoneypotsPage>
  );
};

export { HoneypotsPage };
