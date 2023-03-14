import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyledSetupReview } from "./styles";
import { VaultEditorFormContext } from "../../store";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export function SetupReview() {
  const { t } = useTranslation();

  const { isEditingExitingVault } = useContext(VaultEditorFormContext);

  return (
    <StyledSetupReview>
      <div className="helper-text">
        {isEditingExitingVault ? t("vaultEditorFinishedEditionExplanation") : t("vaultEditorFinishedSetupExplanation")}
      </div>

      <p className="section-title">{t("nextSteps")}</p>
      {isEditingExitingVault ? (
        <>
          <div className="next-step">
            <div className="title">
              <ArrowForwardIcon className="mr-2" /> {t("sendToGovernanceApproval")}
            </div>
          </div>
          <div className="next-step">
            <div className="title">
              <ArrowForwardIcon className="mr-2" /> {t("waitForApproval")}
            </div>
          </div>
          <div className="next-step">
            <div className="title">
              <ArrowForwardIcon className="mr-2" /> {t("weWillNotifyYouWhenEditionIsApproved")}
            </div>
          </div>
        </>
      ) : (
        <div className="next-step">
          <div className="title">
            <ArrowForwardIcon className="mr-2" /> {t("deployVault")}
          </div>
          <div className="helper-text">{t("deployVaultHelper")}</div>
        </div>
      )}
    </StyledSetupReview>
  );
}
