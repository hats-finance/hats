
import "../styles/Pool.scss";
import { IVault } from "../types/types";

interface IProps {
  data: IVault,
  setShowModal: (show: boolean) => any,
  setModalData: (data: any) => any
}

// TODO: it's temporary hardcoded until the LP will be available in the subgraph.
export default function Pool(props: IProps) {
  // const { name } = props.data;
  return (
    <div className="pool-wrapper" onClick={() => { props.setShowModal(true); props.setModalData(props.data) }}>
      <div className="title-wrapper">
        <img src={require("../assets/icons/vaults/uniswap.svg").default} alt="uniswap logo" />
        <span className="title">UNISWAP</span>
      </div>
      <div className="info">
        <div>
          <img src={require("../assets/icons/vaults/hats.svg").default} alt="hats logo" />
          <img src={require("../assets/icons/vaults/etherum.svg").default} alt="etherum logo" />
        </div>
        <span>HATS/WETH LP POOL</span>
      </div>
    </div>
  )
}
