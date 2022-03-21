
import { getCurrentVotes } from "actions/contractsActions";
import axios from "axios";
import classNames from "classnames";
import { REWARDS_TOKEN, DELEGATEES_IPFS, IDelegateeData } from "components/Airdrop/constants";
import Loading from "components/Shared/Loading";
import Modal from "components/Shared/Modal";
import { IPFS_PREFIX } from "constants/constants";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { Stage, TokenAirdropContext } from "../../TokenAirdrop";
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
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    (async () => {
      setVotes(await getCurrentVotes(data.address, REWARDS_TOKEN));
    })();
  }, [data.address])

  return (
    <div className={classNames("delegatee-element", { "selected": selected })}>
      <img src={`${data.image.replace("ipfs://", `${IPFS_PREFIX}/`)}`} alt="delegatee avatar" />
      <div className="delegatee-info">
        <div className="delegatee-name">{data.name}</div>
        <div className="delegatee-username-votes">{`${data.tweeter_username} · ${votes} Votes`}</div>
        <div className="delegatee-role">{data.role}</div>
        <div className="delegatee-actions-container">
          <div className="read-more" onClick={() => setShowDescription(true)}>Read More</div>
          <div className="choose" onClick={() => setDelegatee({ ...data, votes: votes })}>Choose</div>
        </div>
      </div>

      {showDescription && (
        <Modal title={data.name} setShowModal={setShowDescription} height="fit-content">
          <div className="delegatee-description-container">
            {data.description}
          </div>
        </Modal>)}
    </div>
  )
}

export default function ChooseDelegatee({ address, selectedDelegatee, setDelegatee }: IProps) {
  const { setStage } = useContext(TokenAirdropContext);
  const [selfDelegatee, setSelfDelegatee] = useState(selectedDelegatee?.self ? true : false);
  const [loading, setLoading] = useState(true);
  const [delegatees, setDelegatees] = useState<IDelegateeData[]>();

  useEffect(() => {
    (async () => {
      try {
        const delegateesData = (await axios.get(`${IPFS_PREFIX}/${DELEGATEES_IPFS}`));
        setDelegatees(delegateesData.data.delegates);
      } catch (error) {
        console.error(error);
        // TODO: show error to the user - maybe have the option of self delegatee only?
      }
      setLoading(false);
    })();
  }, [])

  const delegateesElements = delegatees?.map((delegateeData, index) => {
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
      {loading ? <Loading /> : (
        <>
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
        </>
      )}
    </div>
  )
}
