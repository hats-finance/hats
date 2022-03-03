
import { t } from "i18next";
import { useContext } from "react";
import { Stage, TokenAirdropContext } from "../../TokenAirdrop";
import { DATA } from "./data";
import "./index.scss";

interface IProps {
  setDelegatee: Function
}

interface IDelegateeElementProps {
  setDelegatee: Function
  address: string
}

const DelegateeElement = ({ address, setDelegatee }: IDelegateeElementProps) => {
  const { setStage } = useContext(TokenAirdropContext);

  return (
    <div className="delegatee-element" onClick={() => { setDelegatee(address); setStage(Stage.Claim); }}>
      {address}
    </div>
  )
}

export default function ChooseDelegatee({ setDelegatee }: IProps) {
  const { setStage } = useContext(TokenAirdropContext);

  const delegateesElements = DATA.map((delegateeData, index) => {
    return <DelegateeElement key={index} address={delegateeData.address} setDelegatee={setDelegatee} />
  })

  return (
    <div className="choose-delegatee-wrapper">
      <h3>{t("Airdrop.TokenAirdrop.ChooseDelegatee.section-1-title")}</h3>
      <p>{t("Airdrop.TokenAirdrop.ChooseDelegatee.section-1")}</p>

      <span>{t("Airdrop.TokenAirdrop.ChooseDelegatee.choose-delegatee")}</span>
      {delegateesElements}
      <div className="actions-wrapper">
        <button className="back-btn" onClick={() => setStage(Stage.Protocol)}>BACK</button>
      </div>
    </div>
  )
}
