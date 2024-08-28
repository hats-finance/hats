import { Alert } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useTranslation } from "react-i18next";
import { CuratorFormType } from "../CuratorFormModal";

export const CuratorTermsAndConditions = () => {
  const { t } = useTranslation();

  const {
    setValue,
    watch,
    formState: { errors },
  } = useEnhancedFormContext<CuratorFormType>();
  const haveAccepted = watch("termsAndConditions");
  const hasErrors = !!errors.termsAndConditions;

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.termsAndConditionsTitle")}</div>
      <p dangerouslySetInnerHTML={{ __html: t("CuratorForm.readTermsAndConditionsHere") }} />

      <div className="options mt-5">
        <div
          className="option"
          onClick={() => {
            setValue("termsAndConditions", true, { shouldValidate: true });
          }}
        >
          <div className={`check-circle ${haveAccepted ? "selected" : ""} ${hasErrors ? "error" : ""}`} />
          <div className="info">
            <p>{t("yes")}</p>
          </div>
        </div>

        <div
          className="option"
          onClick={() => {
            setValue("termsAndConditions", false, { shouldValidate: true });
          }}
        >
          <div
            className={`check-circle ${haveAccepted !== undefined && !haveAccepted ? "selected" : ""} ${
              hasErrors ? "error" : ""
            }`}
          />
          <div className="info">
            <p>{t("no")}</p>
          </div>
        </div>
      </div>

      {hasErrors && (
        <Alert className="w-100 mt-5" type="error">
          {t("CuratorForm.youNeedToAcceptTermsAndConditions")}
        </Alert>
      )}
    </div>
  );
};
