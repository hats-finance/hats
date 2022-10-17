import { useTranslation } from "react-i18next";
import { ipfsTransformUri } from "utils";
import { ISeverity } from "../../types/types";
import Media from "../Shared/Media/Media";
import "styles/NFTPrize.scss";

interface IProps {
  data: ISeverity
}

export default function NFTPrize(props: IProps) {
  const { t } = useTranslation();
  const severity = props.data;

  return (
    <div className="nft-prize-wrapper">
      <span className="nft-name">{severity?.["nft-metadata"]?.name}</span>
      <Media link={ipfsTransformUri(severity?.["nft-metadata"]?.image)} className="nft-prize__video" />
      <div className="nft-info">
        <span className="subtitle">{t("NFTPrize.description")}</span>
        <span className="data">{severity?.["nft-metadata"]?.description}</span>
        <span className="subtitle">{t("NFTPrize.severity")}</span>
        <span className="data">{severity?.name.toUpperCase()}</span>
      </div>
    </div>
  )
}
