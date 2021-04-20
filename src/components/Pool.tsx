
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import "../styles/Pool.scss";
import { IVault } from "../types/types";
import { isProviderAndNetwork } from "../utils";

interface IProps {
  data: IVault,
  setShowModal: (show: boolean) => any,
  setModalData: (data: any) => any
}

export default function Pool(props: IProps) {
  const { name } = props.data;
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);

  return (
    <div className="pool-wrapper">
      <div className="title-wrapper">
        <img src={require("../assets/icons/vaults/uniswap.svg").default} alt="uniswap logo" />
        <span className="title">{name.split(' ')[0]}</span>
      </div>
      <div className="info">
        <div>
          <img src={require("../assets/icons/vaults/hats.svg").default} alt="hats logo" />
          <img src={require("../assets/icons/vaults/etherum.svg").default} alt="etherum logo" />
        </div>
        <span>{name}</span>
        <button
          className="open-pool"
          disabled={!isProviderAndNetwork(provider)}
          onClick={() => { props.setShowModal(true); props.setModalData(props.data) }}>OPEN</button>
      </div>
    </div>
  )
}
