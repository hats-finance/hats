import { useTranslation } from "react-i18next";

const roles = ["growthSeeker", "growthGenius", "growthWizard"];

export const CuratorRoles = () => {
  const { t } = useTranslation();

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.selectARole")}</div>
      <p>{t("CuratorForm.selectARoleDesc")}</p>
    </div>
  );
};
