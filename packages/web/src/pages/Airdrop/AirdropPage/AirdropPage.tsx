import { Seo } from "components";
import { useTranslation } from "react-i18next";
import { StyledAidropPage } from "./styles";

export const AirdropPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t("seo.leaderboardTitle")} />
      <StyledAidropPage className="content-wrapper">
        <h2 className="subtitle">{t("airdrop")}</h2>
      </StyledAidropPage>
    </>
  );
};
