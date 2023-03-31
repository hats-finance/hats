import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { CopyToClipboard } from "components";
import { RoutePaths } from "navigation";
import { StyledPayoutFormPage, StyledPayoutForm } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

export const PayoutFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [lastModifedOn, setLastModifedOn] = useState<Date | undefined>(new Date());

  return (
    <StyledPayoutFormPage className="content-wrapper-md">
      <div className="title-container">
        {lastModifedOn && (
          <p className="lastModifiedOn">
            <strong>{t("saved")}</strong> {moment(lastModifedOn).fromNow()}
          </p>
        )}

        <div className="title" onClick={() => navigate(`${RoutePaths.payouts}`)}>
          <BackIcon />
          <p>{t("payouts")}</p>
        </div>

        <CopyToClipboard valueToCopy={document.location.href} overlayText={t("Payouts.copyPayoutLink")} />
      </div>

      <div className="section-title">{t("Payouts.creatingSinglePayout")}</div>

      <StyledPayoutForm>Form</StyledPayoutForm>
    </StyledPayoutFormPage>
  );
};
