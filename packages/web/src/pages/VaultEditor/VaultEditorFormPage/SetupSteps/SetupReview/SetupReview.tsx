import { useTranslation } from "react-i18next";
import { useWatch } from "react-hook-form";
import { IEditedVaultDescription } from "types";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { StyledSetupReview } from "./styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export function SetupReview() {
  const { t } = useTranslation();

  const { control } = useEnhancedFormContext<IEditedVaultDescription>();

  const isEditingVault = !!useWatch({ control, name: "vaultCreatedInfo.vaultAddress" });

  return (
    <StyledSetupReview>
      <div className="helper-text">
        {isEditingVault ? t("vaultEditorFinishedEditionExplanation") : t("vaultEditorFinishedSetupExplanation")}
      </div>

      <p className="section-title">{t("nextStep")}</p>
      <div className="next-step">
        <ArrowForwardIcon className="mr-2" /> {t("sendToGovernanceApproval")}
      </div>
      <div className="next-step">
        <ArrowForwardIcon className="mr-2" /> {t("waitForApproval")}
      </div>
      <div className="next-step">
        <ArrowForwardIcon className="mr-2" /> {t("weWillNotifyYouWhenEditionIsApproved")}
      </div>
    </StyledSetupReview>
  );
}
