import { useEffect, useState } from "react";
import Loading from "./Shared/Loading";
import Modal from "./Shared/Modal";
import Vault from "./Vault/Vault";
import DepositWithdraw from "./DepositWithdraw/DepositWithdraw";
import "../styles/Honeypots.scss";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { IVault } from "../types/types";
import SafePeriodBar from "./SafePeriodBar";
import SearchIcon from "../assets/icons/search.icon";
import { ScreenSize } from "../constants/constants";
import { useVaults } from "hooks/useVaults";
import { fromWei } from "utils";

export default function Honeypots() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { vaults } = useVaults();
  const [selectedVault, setSelectedVault] = useState("");
  const [vaultIcon, setVaultIcon] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  useEffect(() => {
    if (modalData) {
      const description = (modalData as any).description;
      setSelectedVault(description?.["project-metadata"]?.name);
      setVaultIcon(description?.["project-metadata"]?.icon);
    }
  }, [modalData])

  const guestVaults: Array<JSX.Element> = [];

  const vaultValue = (vault: IVault) => {
    const { honeyPotBalance, stakingTokenDecimals, tokenPrice } = vault.parentVault;
    return Number(fromWei(honeyPotBalance, stakingTokenDecimals)) * tokenPrice
  }

  const vaultsDisplay = (vaults as IVault[])?.sort((a: IVault, b: IVault) => {
    return vaultValue(b) - vaultValue(a);
  }).map((vault: IVault) => {
    // TODO: temp to not show guest vaults
    if (!vault.parentVault.liquidityPool && vault.parentVault.registered && !vault.isGuest) {
      if (vault.name.toLowerCase().includes(userSearch.toLowerCase())) {
        if (vault.isGuest) {
          guestVaults.push(<Vault key={vault.id} data={vault} setShowModal={setShowModal} setModalData={setModalData} />);
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
                  <th>PRIZE GIVEN</th>
                  <th>APY</th>
                  <th></th>
                </>
              )}
            </tr>
            <tr className="transparent-row">
              <td colSpan={7}>Hats Native vaults</td>
            </tr>
            {vaultsDisplay}
            {guestVaults.length > 0 &&
              <tr className="transparent-row">
                <td colSpan={7}>Hats Guest bounties</td>
              </tr>}
            {guestVaults}
          </tbody>
        </table>}
      {showModal &&
        <Modal title={selectedVault} setShowModal={setShowModal} height="fit-content" maxHeight="100vh" icon={vaultIcon}>
          <DepositWithdraw data={modalData as any} setShowModal={setShowModal} />
        </Modal>}
    </div>
  )
}
