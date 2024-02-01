import { IVault } from "@hats.finance/shared";
import { WithTooltip } from "components";
import millify from "millify";
import { appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { StyledVaultTokenIcon } from "./styles";

type VaultTokenIconProps = {
  vault: IVault;
};

export const VaultTokenIcon = ({ vault }: VaultTokenIconProps) => {
  if (!vault.description) return null;

  const tokenIcon = vault.description["project-metadata"].tokenIcon;
  const tokenSymbol = vault.stakingTokenSymbol;
  const tokenPrice = vault.amountsInfo?.tokenPriceUsd ?? 0;
  const chainName = appChains[vault.chainId].chain.name;

  return (
    <StyledVaultTokenIcon>
      <WithTooltip text={`${tokenSymbol} (${chainName}) | ~$${millify(tokenPrice)} per token`}>
        <div className="images">
          <img className="logo" src={ipfsTransformUri(tokenIcon)} alt="token" />
          <img className="chain" src={require(`assets/icons/chains/${vault.chainId}.png`)} alt="network" />
        </div>
      </WithTooltip>
      <span>{tokenSymbol}</span>
    </StyledVaultTokenIcon>
  );
};
