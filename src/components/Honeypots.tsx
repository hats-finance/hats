import { useCallback, useEffect, useState } from "react";
import Loading from "./Shared/Loading";
import Modal from "./Shared/Modal";
import Vault from "./Vault/Vault";
import DepositWithdraw from "./DepositWithdraw/DepositWithdraw";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { IVault } from "../types/types";
import SafePeriodBar from "./SafePeriodBar";
import SearchIcon from "../assets/icons/search.icon";
import { ScreenSize } from "../constants/constants";
import { useVaults } from "hooks/useVaults";
import { fromWei } from "utils";
import "../styles/Honeypots.scss";

export default function Honeypots() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { vaults } = useVaults();
  const [selectedVault, setSelectedVault] = useState("");
  const [vaultIcon, setVaultIcon] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const tokenPrices = useSelector((state: RootState) => state.dataReducer.tokenPrices);

  useEffect(() => {
    if (modalData) {
      const description = (modalData as any).description;
      setSelectedVault(description?.["project-metadata"]?.name);
      setVaultIcon(description?.["project-metadata"]?.icon);
    }
  }, [modalData])

  const gamificationVaults: Array<JSX.Element> = [];

  const vaultValue = useCallback((vault: IVault) => {
    const { honeyPotBalance, stakingTokenDecimals } = vault;
    const tokenPrice = tokenPrices?.[vault.stakingToken]?.['usd'];

    return tokenPrice ? Number(fromWei(honeyPotBalance, stakingTokenDecimals)) * tokenPrice : 0;
  }, [tokenPrices])

  const vaultsDisplay = (vaults as IVault[])?.sort((a: IVault, b: IVault) => {
    return vaultValue(b) - vaultValue(a);
  }).map((vault: IVault) => {
    if (!vault.liquidityPool && vault.registered) {
      if (vault?.description?.["project-metadata"].name.toLowerCase().includes(userSearch.toLowerCase())) {
        if (vault.description?.["project-metadata"]?.gamification) {
          gamificationVaults.push(<Vault key={vault.id} data={vault} setShowModal={setShowModal} setModalData={setModalData} />);
          return null;
        }
        return <Vault key={vault.id} data={vault} setShowModal={setShowModal} setModalData={setModalData} />;
      }
    }
    return null;
  });

  return (
    <div className="content honeypots-wrapper">
      {vaults === undefined ? <Loading fixed /> :
        <table>
          <tbody>
            <SafePeriodBar />
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
            {gamificationVaults.length > 0 && (
              <tr className="transparent-row">
                <td colSpan={7}>Gamification vault</td>
              </tr>
            )}
            {gamificationVaults}
            <tr className="transparent-row">
              <td colSpan={7}>Hats Native vaults</td>
            </tr>
            {vaultsDisplay}
          </tbody>
        </table>}
      {showModal &&
        <Modal title={selectedVault} setShowModal={setShowModal} height="fit-content" maxHeight="100vh" icon={vaultIcon}>
          <DepositWithdraw data={modalData as any} setShowModal={setShowModal} />
        </Modal>}
    </div>
  )
}
