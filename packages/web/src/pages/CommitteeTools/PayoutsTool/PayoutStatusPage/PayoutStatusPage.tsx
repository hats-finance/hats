import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RoutePaths } from "navigation";
import { StyledPayoutStatusPage } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { CopyToClipboard } from "components";

export const PayoutStatusPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <StyledPayoutStatusPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title" onClick={() => navigate(`${RoutePaths.payouts}/chainId/vaultAddress`)}>
          <BackIcon />
          <p>{t("payouts")}</p>
        </div>

        <CopyToClipboard valueToCopy={document.location.href} overlayText={t("Payouts.copyPayoutLink")} />
      </div>

      <div className="section-title">{t("Payouts.payoutStatus")}</div>
    </StyledPayoutStatusPage>
  );
};