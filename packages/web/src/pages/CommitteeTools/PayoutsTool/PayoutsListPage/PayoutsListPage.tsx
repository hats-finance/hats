import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RoutePaths } from "navigation";
import { StyledPayoutsListPage, PayoutListSections, PayoutListSection } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { CopyToClipboard } from "components";
import { useState } from "react";

export const PayoutsListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [section, setSection] = useState<"in_progress" | "finished">("in_progress");

  return (
    <StyledPayoutsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title" onClick={() => navigate(RoutePaths.payouts)}>
          <BackIcon />
          <p>{t("payouts")}</p>
        </div>

        <CopyToClipboard valueToCopy={document.location.href} overlayText={t("Payouts.copyPayoutListLink")} />
      </div>

      <PayoutListSections>
        <PayoutListSection active={section === "in_progress"} onClick={() => setSection("in_progress")}>
          {t("inProgress")}
        </PayoutListSection>
        <PayoutListSection active={section === "finished"} onClick={() => setSection("finished")}>
          {t("history")}
        </PayoutListSection>
      </PayoutListSections>
    </StyledPayoutsListPage>
  );
};
