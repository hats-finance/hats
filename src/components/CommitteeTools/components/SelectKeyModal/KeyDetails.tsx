import { useTranslation } from "react-i18next";
import { IStoredKey } from "types/types";
import CopyToClipboard from "components/Shared/CopyToClipboard";
import "./index.scss";

function KeyDetails({
  storedKey,
  onFinish
}: {
  storedKey: IStoredKey;
  onFinish: () => any;
}) {
  const { t } = useTranslation();

  return (
    <div className="keymodal-keydetails">
      <p className="keymodal-keydetails__description">
        {t("CommitteeTools.KeyDetails.description")}
      </p>
      <div className="keymodal-keydetails__result-copy">
        <span className="keymodal-keydetails__result-label">
          {t("CommitteeTools.KeyDetails.private-key")}
        </span>
        <CopyToClipboard value={storedKey.privateKey} />
      </div>
      {storedKey.passphrase && (
        <div className="keymodal-keydetails__result-copy">
          <span className="keymodal-keydetails__result-label">
            {t("CommitteeTools.KeyDetails.passphrase")}
          </span>
          <CopyToClipboard value={storedKey.passphrase} />
        </div>
      )}
      <div className="keymodal-keydetails__result-copy">
        <span className="keymodal-keydetails__result-label">
          {t("CommitteeTools.KeyDetails.public-key")}
        </span>
        <CopyToClipboard value={storedKey.publicKey} />
      </div>
      <div className="keymodal-keydetails__button-container">
        <button onClick={onFinish}>Back</button>
      </div>
    </div>
  );
}

export default KeyDetails;
