import React, { useCallback, useState } from "react";
import Loading from "./Shared/Loading";
import Modal from "./Shared/Modal";
import Vault from "./Vault/Vault";
import DepositWithdraw from "./DepositWithdraw/DepositWithdraw";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { IVault } from "../types/types";
//import SafePeriodBar from "./SafePeriodBar";
import SearchIcon from "../assets/icons/search.icon";
import { RoutePaths, ScreenSize } from "../constants/constants";
import { useVaults } from "hooks/useVaults";
import { fromWei } from "utils";
import "../styles/Honeypots.scss";
import { useNavigate, useParams } from "react-router-dom";

interface IProps {
  showDeposit?: boolean
}

export default function Honeypots({ showDeposit }: IProps) {
  const { vaults, tokenPrices } = useVaults();
  const [expanded, setExpanded] = useState();
  const [userSearch, setUserSearch] = useState("");
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const { pid } = useParams();
  const navigate = useNavigate();
  const selectedVault = pid ? vaults?.find(v => v.pid === pid) : undefined;

  const vaultValue = useCallback((vault: IVault) => {
    const { honeyPotBalance, stakingTokenDecimals } = vault;
    const tokenPrice = tokenPrices?.[vault.stakingToken];
    return tokenPrice ? Number(fromWei(honeyPotBalance, stakingTokenDecimals)) * tokenPrice : 0;
  }, [tokenPrices])

  const closeModal = useCallback(() => {
    navigate(`${RoutePaths.vaults}`);
  }, [navigate])

  const scrollRef = useCallback(element => {
    if (element) {
      element.scrollIntoView()
    }
  }, [])
  const sortedVaults = vaults?.sort((a: IVault, b: IVault) => vaultValue(b) - vaultValue(a))
  const vaultsMatchSearch = sortedVaults?.filter(vault =>
    vault.description?.["project-metadata"].name.toLowerCase()
      .includes(userSearch.toLowerCase()));

  const normalVaultKey: string = ''

  const vaultsByGroup = vaultsMatchSearch?.reduce((groups, vault) => {
    if (vault.registered) {
      const key = vault.description?.["project-metadata"].type || normalVaultKey;
      (groups[key] = groups[key] || []).push(vault);
    }
    return groups;
  }, [] as IVault[][])!

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="content honeypots-wrapper">
      {vaults === undefined ? <Loading fixed /> :
        <table>
          <tbody>
            {/* <SafePeriodBar /> */}
            <tr>
              <th colSpan={screenSize === ScreenSize.Desktop ? 2 : 3} className="search-cell" >
                <div className="search-wrapper">
                  <SearchIcon />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="search-input"
                    placeholder="Search vault..." />
                </div>
              </th>
              {screenSize === ScreenSize.Desktop && (
                <>
                  <th>TOTAL VAULT</th>
                  <th>APY</th>
                  <th></th>
                </>
              )}
            </tr>
            {vaultsByGroup && Object.entries(vaultsByGroup).map(([type, vaults]) =>
              <React.Fragment key={type}>
                <tr className="transparent-row">
                  <td colSpan={7}>{type === normalVaultKey ? "Bounty" : capitalizeFirstLetter(type)} Vaults</td>
                </tr>
                {vaults && vaults.map(vault =>
                  <Vault
                    ref={vault.pid === pid ? scrollRef : null}
                    expanded={expanded === vault}
                    setExpanded={setExpanded}
                    key={vault.id}
                    data={vault} />
                )}
              </React.Fragment>
            )}
          </tbody>
        </table>}
      {
        showDeposit && selectedVault &&
        <Modal
          title={selectedVault.description?.["project-metadata"].name!}
          setShowModal={closeModal}
          height="fit-content"
          maxHeight="100vh"
          icon={selectedVault.description?.["project-metadata"].icon!}>
          <DepositWithdraw data={selectedVault!} setShowModal={closeModal} />
        </Modal>
      }
    </div >
  )
}
