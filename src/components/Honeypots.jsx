import React, { useState } from "react";
import { GET_VAULTS } from "../graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import Loading from "./Shared/Loading";
import Modal from "./Shared/Modal";
import Vault from "./Vault";
import DepositeWithdraw from "./DepositeWithdraw";
import "../styles/Honeypots.scss";

export default function Honeypots() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_VAULTS);

  // React.useEffect(() => {
  //   if (!loading && !error && data && data.vaults) {
  //     console.log({ vaults: data.vaults });
  //   }
  // }, [loading, error, data]);

  const vaults = data?.vaults.map((vault, index) => {
    return <Vault key={index} data={vault} setShowModal={setShowModal} setModalData={setModalData} />
  });

  return (
    <div className="content honeypots-wrapper">
      {loading ? <Loading fixed /> : <table>
        <tbody>
          <tr>
            <th></th>
            <th>Project</th>
            <th>Honeypot</th>
            <th>Vulnerabilities found</th>
            <th>Funds given</th>
            <th>APY</th>
            <th><button className="vulnerabilities-btn">Submit Vulnerabilities</button></th>
          </tr>
          {vaults}
        </tbody>
      </table>}
      {showModal &&
        <Modal title={modalData.name} setShowModal={setShowModal} >
          <DepositeWithdraw data={modalData} updateVualts={refetch} />
        </Modal>}
    </div>
  )
}
