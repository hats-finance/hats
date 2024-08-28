import { Alert, FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useTranslation } from "react-i18next";
import { CuratorFormType } from "../CuratorFormModal";

export const CuratorWorkedWeb3 = () => {
  const { t } = useTranslation();

  const {
    setValue,
    watch,
    formState: { errors },
    register,
  } = useEnhancedFormContext<CuratorFormType>();
  const haveWorked = watch("workedWithweb3Security");
  const hasErrors = !!errors.workedWithweb3Security || !!errors.workedWithweb3SecurityDescription;

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.haveYouWorkedWithWeb3")}</div>

      <div className="options mt-5">
        <div
          className="option"
          onClick={() => {
            setValue("workedWithweb3Security", true, { shouldValidate: true });
          }}
        >
          <div className={`check-circle ${haveWorked ? "selected" : ""} ${hasErrors ? "error" : ""}`} />
          <div className="info">
            <p>{t("yes")}</p>
          </div>
        </div>
        {haveWorked && (
          <FormInput
            {...register("workedWithweb3SecurityDescription")}
            type="textarea"
            rows={4}
            label={t("typeHere")}
            className="mt-1"
          />
        )}

        <div
          className="option"
          onClick={() => {
            setValue("workedWithweb3Security", false, { shouldValidate: true });
          }}
        >
          <div
            className={`check-circle ${haveWorked !== undefined && !haveWorked ? "selected" : ""} ${hasErrors ? "error" : ""}`}
          />
          <div className="info">
            <p>{t("no")}</p>
          </div>
        </div>
      </div>

      {hasErrors && (
        <Alert className="w-100 mt-5" type="error">
          {t("CuratorForm.pleaseSelectAnAnswer")}
        </Alert>
      )}
    </div>
  );
};
