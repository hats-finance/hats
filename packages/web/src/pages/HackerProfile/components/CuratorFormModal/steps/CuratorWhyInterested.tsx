import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useTranslation } from "react-i18next";
import { CuratorFormType } from "../CuratorFormModal";

export const CuratorWhyInterested = () => {
  const { t } = useTranslation();

  const { register } = useEnhancedFormContext<CuratorFormType>();

  return (
    <div className="curator-step">
      <div className="title">{t("CuratorForm.whyInterested")}</div>

      <FormInput {...register("whyInterested")} type="textarea" label={t("typeHere")} />
    </div>
  );
};
