import { t } from "i18next";
import CheckmarkIcon from "assets/icons/checkmark.icon";
import { Colors } from "constants/constants";
import classNames from "classnames";
import "./index.scss";

interface IProps {
  stage: number
}

interface IStageElemmentProps {
  stage: number
  index: number
  name: string
}

const StageElement = ({ stage, index, name }: IStageElemmentProps) => {

  return (
    <div className="stage-element">
      <div className="stage-number">
        {stage > index ? <CheckmarkIcon fill={Colors.turquoise} /> : index}
      </div>
      <div className={classNames("stage-name", { "current": stage === index })}>{name}</div>
    </div>
  )
}

export default function ProgressBar({ stage }: IProps) {

  const STAGES = [
    {
      index: 1,
      name: t("Airdrop.TokenAirdrop.ProgressBar.protocol"),
    },
    {
      index: 2,
      name: t("Airdrop.TokenAirdrop.ProgressBar.delegatee"),
    },
    {
      index: 3,
      name: t("Airdrop.TokenAirdrop.ProgressBar.claim"),
    }
  ]

  const stagesElements = STAGES.map((stageData) => {
    return <StageElement key={stageData.index} stage={stage} index={stageData.index} name={stageData.name} />
  })

  return (
    <div className="progress-bar-wrapper">
      {stagesElements}
    </div>
  )
}
