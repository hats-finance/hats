
import { getCurrentVotes } from "actions/contractsActions";
import classNames from "classnames";
import { IDelegateeData } from "components/Airdrop/utils";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { truncatedAddress } from "utils";
import { Stage, TokenAirdropContext } from "../../TokenAirdrop";
import { DATA } from "./data";
import "./index.scss";

interface IProps {
  address: string
  setDelegatee: Function
  selectedDelegatee: IDelegateeData | undefined
}

interface IDelegateeElementProps {
  setDelegatee: Function
  data: IDelegateeData
  selected: boolean
}

const DelegateeElement = ({ data, setDelegatee, selected }: IDelegateeElementProps) => {
  const [votes, setVotes] = useState<number | undefined>();

  useEffect(() => {
    (async () => {
      setVotes(await getCurrentVotes(data.address, "0x8C75dB6367e6eE1980d1999598bd38cbfD690A2A"));
    })();
  }, [data.address])

  return (
    <div className={classNames("delegatee-element", { "selected": selected })} onClick={() => setDelegatee({ ...data, votes: votes })}>
      <div className="delegatee-name">{data.name}</div>
      <div className="delegatee-address">{truncatedAddress(data.address)}</div>
      {votes && <div className="delegatee-votes">{`${votes} Votes`}</div>}
    </div>
  )
}

export default function ChooseDelegatee({ address, selectedDelegatee, setDelegatee }: IProps) {
  const { setStage } = useContext(TokenAirdropContext);
  const [selfDelegatee, setSelfDelegatee] = useState(selectedDelegatee?.self ? true : false);

  const delegateesElements = DATA.map((delegateeData, index) => {
    return (
      <DelegateeElement
        key={index}
        data={delegateeData}
        setDelegatee={setDelegatee}
        selected={selectedDelegatee?.address === delegateeData.address} />)
  })

  const handleCheckboxClick = (value: boolean) => {
    if (value === true) {
      setDelegatee({ address: address, self: true });
    } else {
      setDelegatee(undefined);
    }
    setSelfDelegatee(value);
  }

  return (
    <div className="choose-delegatee-wrapper">
      <h3>{t("Airdrop.TokenAirdrop.ChooseDelegatee.section-1-title")}</h3>
      <p>{t("Airdrop.TokenAirdrop.ChooseDelegatee.section-1")}</p>

      <span>{t("Airdrop.TokenAirdrop.ChooseDelegatee.choose-delegatee")}</span>
      <div className={classNames("delegatees-container", { "disabled": selfDelegatee })}>
        {delegateesElements}
      </div>

      <div className="self-delegatee-checkbox-container">
        <input type="checkbox" checked={selfDelegatee} onChange={() => handleCheckboxClick(!selfDelegatee)} />
        <label>{t("Airdrop.TokenAirdrop.ChooseDelegatee.self-delegatee")}</label>
      </div>

      <div className="actions-wrapper">
        <button onClick={() => setStage(Stage.Protocol)}>BACK</button>
        <button className="fill" disabled={!selectedDelegatee} onClick={() => setStage(Stage.Claim)}>NEXT</button>
      </div>
    </div>
  )
}
