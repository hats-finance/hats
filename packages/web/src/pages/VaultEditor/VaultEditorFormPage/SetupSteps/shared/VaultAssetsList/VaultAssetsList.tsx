import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import { useFieldArray } from "react-hook-form";
import { IEditedVaultDescription } from "types";
import { VaultAssetForm } from "./VaultAssetForm/VaultAssetForm";

export const VaultAssetsList = () => {
  const { control } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields: assets, append, remove } = useFieldArray({ control, name: "assets" });

  return (
    <>
      {assets.map((asset, index) => (
        <VaultAssetForm key={asset.id} index={index} append={append} remove={remove} assetsCount={assets.length} />
      ))}
    </>
  );
};
