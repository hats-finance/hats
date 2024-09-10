import { Button, FormSelectInput, FormSelectInputOption } from "components";
import { getCustomIsDirty } from "hooks/form";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import { useApprovedCurators } from "pages/HackerProfile/hooks";
import { useContext } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IEditedVaultDescription } from "types";
import { VaultEditorFormContext } from "../../../store";
import { StyledVaultCuratorForm } from "./styles";

export const VaultCuratorForm = () => {
  const { t } = useTranslation();
  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const { data: curators, isLoading: isLoadingCurators } = useApprovedCurators();

  const { control, watch, setValue } = useEnhancedFormContext<IEditedVaultDescription>();

  const selectedCurator = watch("project-metadata.curator.username");
  const availableRoles = curators?.find((curator) => curator.username === selectedCurator)?.curatorApplication?.roles ?? [];

  const curatorItems =
    curators?.map((curator) => ({
      label: curator.username,
      value: curator.username,
    })) ?? ([] as FormSelectInputOption[]);

  const roleItems =
    availableRoles.map((role) => ({
      label: t(`CuratorForm.${role}`),
      value: role,
    })) ?? ([] as FormSelectInputOption[]);

  const resetCurator = () => {
    setValue("project-metadata.curator", undefined);
    setValue("project-metadata.curator.username", "");
    setValue("project-metadata.curator.role", "" as any);
  };

  return (
    <StyledVaultCuratorForm>
      <Button className="mb-3" styleType="text" onClick={resetCurator}>
        {t("VaultEditor.vault-details.clearCurator")}
      </Button>
      <div className="inputs">
        <Controller
          control={control}
          name={`project-metadata.curator.username`}
          render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
            <FormSelectInput
              isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
              error={error}
              label={t("VaultEditor.vault-details.curatorUsername")}
              placeholder={t("VaultEditor.vault-details.curator-placeholder")}
              colorable
              disabled={allFormDisabled || isLoadingCurators}
              options={curatorItems}
              helper={curators?.find((c) => c.username === selectedCurator)?.addresses?.[0]}
              {...field}
              value={field.value ?? ""}
              flexExpand
            />
          )}
        />
        <Controller
          control={control}
          name={`project-metadata.curator.role`}
          render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
            <FormSelectInput
              isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
              error={error}
              label={t("VaultEditor.vault-details.curatorRole")}
              placeholder={t("VaultEditor.vault-details.curatorRole-placeholder")}
              colorable
              disabled={allFormDisabled || isLoadingCurators || !selectedCurator}
              options={roleItems}
              {...field}
              value={field.value ?? ""}
              flexExpand
            />
          )}
        />
      </div>
    </StyledVaultCuratorForm>
  );
};
