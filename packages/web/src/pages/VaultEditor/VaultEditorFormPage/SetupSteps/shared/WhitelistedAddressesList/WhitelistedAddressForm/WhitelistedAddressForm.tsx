import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button, FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { VaultEditorFormContext } from "pages/VaultEditor/VaultEditorFormPage/store";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { IEditedVaultDescription } from "types";
import { StyledWhitelistedAddressForm } from "./styles";

type WhitelistedAddressFormProps = {
  index: number;
  remove: (index: number) => void;
};

export const WhitelistedAddressForm = ({ index, remove }: WhitelistedAddressFormProps) => {
  const { t } = useTranslation();

  const { register } = useEnhancedFormContext<IEditedVaultDescription>();
  const { allFormDisabled } = useContext(VaultEditorFormContext);

  return (
    <>
      <StyledWhitelistedAddressForm className="emails__item">
        <FormInput
          {...register(`project-metadata.whitelist.${index}.address`)}
          disabled={allFormDisabled}
          noMargin
          colorable
          label={t("VaultEditor.vault-details.whitelistedAddress")}
          placeholder={t("VaultEditor.vault-details.whitelistedAddress-placeholder")}
        />
        <Button styleType="invisible" onClick={() => remove(index)}>
          <DeleteIcon className="mr-2" />
          <span>{t("remove")}</span>
        </Button>
      </StyledWhitelistedAddressForm>
    </>
  );
};
