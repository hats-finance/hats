import { useTranslation } from "react-i18next";
import { FormInput } from "components";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { IEditedVaultAsset, IEditedVaultDescription } from "../../../types";
import { StyledVaultAssetForm } from "./styles";

type VaultAssetFormProps = {
  index: number;
  assetsCount: number;
  append: (data: IEditedVaultAsset) => void;
  remove: (index: number) => void;
};

export function VaultAssetForm({ index, append, remove, assetsCount }: VaultAssetFormProps) {
  const { t } = useTranslation();
  const { register } = useEnhancedFormContext<IEditedVaultDescription>();

  return (
    <StyledVaultAssetForm>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorCreateVaultOnChainExplanation") }} />

      <p className="section-title">{t("assetsInVault")}</p>

      <div className="inputs">
        <FormInput
          {...register(`assets.${index}.address`)}
          label={t("VaultEditor.vault-assets.address")}
          placeholder={t("VaultEditor.vault-assets.address-placeholder")}
          colorable
        />
        {/* <Controller
          control={control}
          name={`assets.${index}.chainId`}
          render={({ field, formState: { errors, dirtyFields, defaultValues } }) => (
            <FormSelectInput
              isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
              error={getPath(errors, field.name)}
              label={t("VaultEditor.vault-assets.chain")}
              placeholder={t("VaultEditor.vault-assets.chain-placeholder")}
              colorable
              options={supportedNetworksOptions}
              {...field}
              value={field.value ?? ""}
            />
          )}
        /> */}
      </div>
    </StyledVaultAssetForm>
  );
}
