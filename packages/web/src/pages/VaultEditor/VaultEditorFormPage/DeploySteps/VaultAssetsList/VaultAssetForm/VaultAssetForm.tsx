import { useContext, useEffect, useState } from "react";
import { IEditedVaultDescription, IEditedVaultAsset } from "@hats-finance/shared";
import { useAccount, useNetwork } from "wagmi";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput, FormSelectInput } from "components";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { appChains } from "settings";
import { StyledVaultAssetForm } from "./styles";
import { getTokenInfo } from "utils/tokens.utils";
import { isAddress } from "utils/addresses.utils";
import { VaultEditorFormContext } from "../../../store";

type VaultAssetFormProps = {
  index: number;
  assetsCount: number;
  append: (data: IEditedVaultAsset) => void;
  remove: (index: number) => void;
};

export function VaultAssetForm({ index, append, remove, assetsCount }: VaultAssetFormProps) {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [assetInfo, setAssetInfo] = useState<string | undefined>(undefined);
  const { register, control, setValue } = useEnhancedFormContext<IEditedVaultDescription>();

  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const vaultChainId = useWatch({ control, name: "committee.chainId" });
  const tokenAddress = useWatch({ control, name: `assets.${index}.address` });

  const showTestnets = address && chain?.testnet;
  const supportedNetworksOptions = Object.values(appChains)
    .filter(
      (chainInfo) =>
        Number(vaultChainId) === chainInfo.chain.id || (showTestnets ? chainInfo.chain.testnet : !chainInfo.chain.testnet)
    )
    .map((chainConf) => ({
      label: chainConf.chain.name,
      value: `${chainConf.chain.id}`,
    }));

  useEffect(() => {
    if (tokenAddress && vaultChainId) {
      setAssetInfo(undefined);
      setValue(`assets.${index}.symbol`, "");

      const isAdd = isAddress(tokenAddress);
      if (!isAdd) return;

      getTokenInfo(tokenAddress, +vaultChainId)
        .then((tokenInfo) => {
          if (tokenInfo.isValidToken) {
            setAssetInfo(`${tokenInfo.name} (${tokenInfo.symbol})`);
            setValue(`assets.${index}.symbol`, tokenInfo.symbol);
          } else {
            setAssetInfo(undefined);
            setValue(`assets.${index}.symbol`, "");
          }
        })
        .catch(() => {
          setAssetInfo(undefined);
          setValue(`assets.${index}.symbol`, "");
        });
    }
  }, [tokenAddress, vaultChainId, index, setValue]);

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
          disabled={allFormDisabled}
          label={t("VaultEditor.vault-assets.address")}
          placeholder={t("VaultEditor.vault-assets.address-placeholder")}
          colorable
          helper={assetInfo}
        />
      </div>
    </StyledVaultAssetForm>
  );
}
