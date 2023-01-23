import { useFieldArray } from "react-hook-form";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { IEditedVaultDescription } from "pages/VaultEditorFormPage/types";
import { VaultAssetForm } from "./VaultAssetForm/VaultAssetForm";

export const VaultAssetsList = () => {
  const { control } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields: assets, append, remove } = useFieldArray<IEditedVaultDescription>({ control, name: "assets" });

  return (
    <>
      {assets.map((asset, index) => (
        <VaultAssetForm key={asset.id} index={index} append={append} remove={remove} assetsCount={assets.length} />
      ))}
    </>
  );
};
