import { useTranslation } from "react-i18next";

// TODO: finish this component
export const LeaderMultiplierCard = () => {
  const { t } = useTranslation();

  return (
    <div className="multiplier">
      <p className="value">x5</p>
      <div className="info">
        <p className="name">{t("MyWallet.leader")}</p>
        <div>
          <p className="mb-2">{t("MyWallet.externalLeaderboardPosition")}</p>
          <strong>
            <i>{t("MyWallet.yourPosition")}</i> x5
          </strong>
        </div>
      </div>
    </div>
  );
};
