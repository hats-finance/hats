import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import useConfirm from "hooks/useConfirm";
import { CopyToClipboard, Button } from "components";
import { RoutePaths } from "navigation";
import { StyledPayoutStatusPage } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

export const PayoutStatusPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  return (
    <StyledPayoutStatusPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title" onClick={() => navigate(`${RoutePaths.payouts}`)}>
          <BackIcon />
          <p>{t("payouts")}</p>
        </div>

        <CopyToClipboard valueToCopy={DOMPurify.sanitize(document.location.href)} overlayText={t("Payouts.copyPayoutLink")} />
      </div>

      <div className="section-title">{t("Payouts.payoutStatus")}</div>

      <Button onClick={() => confirm({ title: "Delete Key", description: "asd" })}>Test</Button>
    </StyledPayoutStatusPage>
  );
};
