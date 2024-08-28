import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useTranslation } from "react-i18next";
import { CuratorFormType } from "../CuratorFormModal";

export const CuratorCommunication = () => {
  const { t } = useTranslation();

  const { register } = useEnhancedFormContext<CuratorFormType>();

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.communicationChannel")}</div>
      <p className="mb-5">{t("CuratorForm.communicationChannelDesc")}</p>

      <FormInput {...register("telegramHandle")} label={t("telegram")} placeholder="e.g @handle" />
      <FormInput {...register("discordHandle")} label={t("discord")} placeholder="e.g username" />
    </div>
  );
};
