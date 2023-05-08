import { IVault } from "@hats-finance/shared";
import { CopyToClipboard } from "components/CopyToClipboard/CopyToClipboard";
import { useTranslation } from "react-i18next";
import { ipfsTransformUri } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { StyledVaultInfoCard } from "./styles";

type VaultInfoCardProps = {
  vault: IVault;
};

export const VaultInfoCard = ({ vault }: VaultInfoCardProps) => {
  const { t } = useTranslation();

  return (
    <StyledVaultInfoCard>
      <div>
        <img src={ipfsTransformUri(vault.description?.["project-metadata"].icon)} alt="logo" />
        <p className="name">{vault.description?.["project-metadata"].name}</p>
      </div>

      {shortenIfAddress(vault.id) && (
        <div className="grey">
          <p className="address">{shortenIfAddress(vault.id)}</p>
          <CopyToClipboard valueToCopy={vault.id} overlayText={t("copyAddress")} />
        </div>
      )}
    </StyledVaultInfoCard>
  );
};
