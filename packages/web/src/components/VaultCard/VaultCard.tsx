import { IVault } from "@hats-finance/shared";
import { ipfsTransformUri } from "utils";
import { StyledVaultCard } from "./styles";

type VaultCardProps = {
  vault: IVault;
};

export const VaultCard = ({ vault }: VaultCardProps) => {
  if (!vault.description) return null;

  const logo = vault.description["project-metadata"].icon;
  const name = vault.description["project-metadata"].name;
  const description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.";

  return (
    <StyledVaultCard>
      <div className="vault-info">
        <div className="metadata">
          <img src={ipfsTransformUri(logo)} alt="logo" />
          <div className="name-description">
            <h3 className="name">{name}</h3>
            <p className="description">{description}</p>
          </div>
        </div>

        <div className="amounts">amounts</div>
      </div>

      <div className="vault-actions">actions</div>
    </StyledVaultCard>
  );
};
