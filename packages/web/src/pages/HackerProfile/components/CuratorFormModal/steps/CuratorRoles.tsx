import { Alert } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useTranslation } from "react-i18next";
import { CuratorFormType } from "../CuratorFormModal";

const roles = ["growthSeeker", "growthGenius", "growthWizard"] as const;

export const CuratorRoles = () => {
  const { t } = useTranslation();

  const {
    watch,
    formState: { errors },
    setValue,
  } = useEnhancedFormContext<CuratorFormType>();
  const selectedRoles = watch("roles") ?? [];
  const hasErrors = !!errors.roles;

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.selectARole")}</div>
      <p>{t("CuratorForm.selectARoleDesc")}</p>

      <div className="options mt-5">
        {roles.map((role) => (
          <div
            className="option"
            onClick={() => {
              setValue(
                "roles",
                selectedRoles.includes(role) ? selectedRoles.filter((r) => r !== role) : [...selectedRoles, role],
                { shouldValidate: true }
              );
            }}
          >
            <div className={`check-circle ${selectedRoles.includes(role) ? "selected" : ""} ${hasErrors ? "error" : ""}`} />
            <div className="info">
              <strong>{t(`CuratorForm.${role}`)}</strong>
              <p>{t(`CuratorForm.${role}Desc`)}</p>
            </div>
          </div>
        ))}
      </div>

      {hasErrors && (
        <Alert className="w-100 mt-5" type="error">
          {t("CuratorForm.selectARoleError")}
        </Alert>
      )}
    </div>
  );
};
