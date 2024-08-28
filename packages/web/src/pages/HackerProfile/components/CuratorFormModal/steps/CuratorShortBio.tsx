import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useTranslation } from "react-i18next";
import { CuratorFormType } from "../CuratorFormModal";

export const CuratorShortBio = () => {
  const { t } = useTranslation();

  const { register } = useEnhancedFormContext<CuratorFormType>();

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.shortBio")}</div>
      <p className="mb-3">{t("CuratorForm.shortBioDesc")}</p>

      <FormInput {...register("shortBio")} type="textarea" label={t("typeHere")} rows={4} />
    </div>
  );
};
