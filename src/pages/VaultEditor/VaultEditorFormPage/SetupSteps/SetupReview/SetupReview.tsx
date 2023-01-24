import { useTranslation } from "react-i18next";
import { StyledSetupReview } from "./styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export function SetupReview() {
  const { t } = useTranslation();

  return (
    <StyledSetupReview>
      <div className="helper-text">{t("vaultEditorFinishedSetupExplanation")}</div>

      <p className="section-title">{t("nextStep")}</p>

      <div className="next-step">
        <ArrowForwardIcon className="mr-2" /> {t("deployVault")}
      </div>
    </StyledSetupReview>
  );
}
