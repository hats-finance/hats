import { useEffect, useState } from "react";
import Loading from "./Shared/Loading";
import Modal from "./Shared/Modal";
import Vault from "./Vault/Vault";
import DepositWithdraw from "./DepositWithdraw";
import "../styles/Honeypots.scss";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { IVault, IVaultDescription } from "../types/types";
import SafePeriodBar from "./SafePeriodBar";

export default function Honeypots() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const vaultsData = useSelector((state: RootState) => state.dataReducer.vaults);
  const [selectedVault, setSelectedVault] = useState("");
  const [vaultIcon, setVaultIcon] = useState("");
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    if (modalData) {
      try {
        const description: IVaultDescription = JSON.parse((modalData as any).description);
        setSelectedVault(description?.["Project-metadata"]?.name);
        setVaultIcon(description?.["Project-metadata"]?.icon);
      } catch (error) {
        console.error(error);
      }
    }
  }, [modalData])


  const vaults = vaultsData.map((vault: IVault) => {
    // TODO: temp hack to not show paraswap
    if (!vault.liquidityPool && vault.registered && vault.pid !== "3") {
      try {
        const description: IVaultDescription = JSON.parse(vault.description as any);
        if (description["Project-metadata"].name.toLowerCase().includes(userSearch.toLowerCase())) {
          return <Vault key={vault.id} data={vault} setShowModal={setShowModal} setModalData={setModalData} />;
        }
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  });

  return (
    <div className="content honeypots-wrapper">
      {vaultsData.length === 0 ? <Loading fixed /> :
        <table>
          <tbody>
            <SafePeriodBar />
            <tr>
              <th colSpan={2} className="search-wrapper">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="search-input"
                  placeholder="Search vault..." />
              </th>
              <th>TOTAL VAULT</th>
              <th>PRIZE GIVEN</th>
              <th>APY</th>
              <th></th>
            </tr>
            <tr className="transparent-row">
              <td colSpan={7}>Hats Native vaults</td>
            </tr>
            {vaults}
            <tr className="transparent-row">
              <td colSpan={7}>Hats Guest bounties</td>
            </tr>
          </tbody>
        </table>}
      {showModal &&
        <Modal title={selectedVault} setShowModal={setShowModal} height="fit-content" maxHeight="100vh" icon={vaultIcon}>
          <DepositWithdraw data={modalData as any} setShowModal={setShowModal} />
        </Modal>}
    </div>
  )
}
