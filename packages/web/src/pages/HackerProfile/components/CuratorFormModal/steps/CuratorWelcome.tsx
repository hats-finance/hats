import { useTranslation } from "react-i18next";

export const CuratorWelcome = () => {
  const { t } = useTranslation();

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.welcomeTitle")}</div>
      <div dangerouslySetInnerHTML={{ __html: t("CuratorForm.welcomeContent") }} />
    </div>
  );
};
