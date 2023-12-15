import { IVault } from "@hats.finance/shared";
import OpenLinkIcon from "@mui/icons-material/OpenInNewOutlined";
import { CopyToClipboard } from "components/CopyToClipboard/CopyToClipboard";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { StyledVaultInfoCard } from "./styles";

type VaultInfoCardProps = {
  vault: IVault;
};

export const VaultInfoCard = ({ vault }: VaultInfoCardProps) => {
  const { t } = useTranslation();

  // Open block explorer on vault's chain
  const handleOpenBlockExplorer = () => {
    const network = vault.chainId ? appChains[vault.chainId] : null;

    if (network) {
      window.open(`${network.chain.blockExplorers?.default.url}/address/${vault.id}`, "_blank");
    }
  };

  return (
    <StyledVaultInfoCard>
      <div>
        <img src={ipfsTransformUri(vault.description?.["project-metadata"].icon)} alt="logo" />
        <p className="name">{vault.description?.["project-metadata"].name}</p>
      </div>

      {shortenIfAddress(vault.id) && (
        <div className="grey">
          <p className="address">
            <span>{shortenIfAddress(vault.id)}</span>
            <span>{vault.chainId && <span className="address">({appChains[vault.chainId].chain.name})</span>}</span>
          </p>

          <CopyToClipboard valueToCopy={vault.id} overlayText={t("copyAddress")} simple />
          <OpenLinkIcon className="icon" onClick={handleOpenBlockExplorer} />
        </div>
      )}
    </StyledVaultInfoCard>
  );
};
