import { Alert } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useTranslation } from "react-i18next";
import { CuratorFormType } from "../CuratorFormModal";

const services = [
  "Introduce projects to Hats",
  "Setup an audit competition vault",
  "Promote the audit competitions into the security researchers ecosystem",
  "Managed the audit competition and mitigated between SR and the project core team (Committee of the competition)",
  "Review the submissions from the auditors and support the team",
  "Participate in the audit competition as a lead auditor",
  "Support or facilitate the dispute period as a security researcher",
];

export const CuratorServices = () => {
  const { t } = useTranslation();

  const {
    watch,
    formState: { errors },
    setValue,
  } = useEnhancedFormContext<CuratorFormType>();
  const selectedServices = watch("services") ?? [];
  const hasErrors = !!errors.services;

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.selectServices")}</div>
      <p>{t("CuratorForm.selectServicesDesc")}</p>

      <div className="options mt-5">
        {services.map((service) => (
          <div
            className="option"
            onClick={() => {
              setValue(
                "services",
                selectedServices.includes(service)
                  ? selectedServices.filter((r) => r !== service)
                  : [...selectedServices, service],
                { shouldValidate: true }
              );
            }}
          >
            <div className={`check-circle ${selectedServices.includes(service) ? "selected" : ""} ${hasErrors ? "error" : ""}`} />
            <div className="info">
              <p>{service}</p>
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
