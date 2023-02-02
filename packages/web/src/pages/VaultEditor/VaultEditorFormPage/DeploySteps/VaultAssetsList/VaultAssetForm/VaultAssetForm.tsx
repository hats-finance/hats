import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput, FormSelectInput } from "components";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { IEditedVaultAsset, IEditedVaultDescription } from "types";
import { StyledVaultAssetForm } from "./styles";
import { ChainsConfig } from "config/chains";
import { getTokenInfo } from "utils/tokens.utils";
import { isAddress } from "utils/addresses.utils";

type VaultAssetFormProps = {
  index: number;
  assetsCount: number;
  append: (data: IEditedVaultAsset) => void;
  remove: (index: number) => void;
};

export function VaultAssetForm({ index, append, remove, assetsCount }: VaultAssetFormProps) {
  const { t } = useTranslation();
  const [assetInfo, setAssetInfo] = useState<string | undefined>(undefined);
  const { register, control } = useEnhancedFormContext<IEditedVaultDescription>();

  const supportedNetworksOptions = Object.values(ChainsConfig).map((chainConf) => ({
    label: chainConf.chain.name,
    value: `${chainConf.chain.id}`,
  }));

  const vaultChainId = useWatch({ control, name: "committee.chainId" });
  const tokenAddress = useWatch({ control, name: `assets.${index}.address` });

  useEffect(() => {
    if (tokenAddress && vaultChainId) {
      setAssetInfo(undefined);

      const isAdd = isAddress(tokenAddress);
      if (!isAdd) return;

      getTokenInfo(tokenAddress, +vaultChainId)
        .then((tokenInfo) => {
          if (tokenInfo.isValidToken) setAssetInfo(`${tokenInfo.name} (${tokenInfo.symbol})`);
          else setAssetInfo(undefined);
        })
        .catch(() => setAssetInfo(undefined));
    }
  }, [tokenAddress, vaultChainId]);

  return (
    <StyledVaultAssetForm>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorCreateVaultOnChainExplanation") }} />

      <p className="section-title">{t("assetsInVault")}</p>

      <div className="inputs">
        <div>
          <FormSelectInput
            disabled
            name="chainId"
            onChange={() => {}}
            label={t("VaultEditor.vault-assets.chain")}
            placeholder={t("VaultEditor.vault-assets.chain-placeholder")}
            options={supportedNetworksOptions}
            value={vaultChainId ?? ""}
          />
        </div>
        <FormInput
          {...register(`assets.${index}.address`)}
          label={t("VaultEditor.vault-assets.address")}
          placeholder={t("VaultEditor.vault-assets.address-placeholder")}
          colorable
          helper={assetInfo}
        />
      </div>
    </StyledVaultAssetForm>
  );
}
