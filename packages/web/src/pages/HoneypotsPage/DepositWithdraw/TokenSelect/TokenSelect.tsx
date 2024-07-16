import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import Tooltip from "rc-tooltip";
import Select from "react-select";
import { IVault } from "types";
import { ipfsTransformUri } from "utils";
import { useNetwork } from "wagmi";
import "./index.scss";
import { StyledVaultChainIcon } from "./styles";

interface IProps {
  vault: IVault;
  onSelect: (id: string) => void;
}

interface ITokenOptionProps {
  symbol: string;
  icon: string | undefined;
}

const VaultChainIcon = ({ vault }: { vault: IVault }) => {
  const { chains } = useNetwork();
  const network = chains.find((c) => c.id === vault.chainId);

  return (
    <StyledVaultChainIcon>
      <Tooltip overlayClassName="tooltip" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE as any} overlay={network?.name}>
        <div className="chain-logo">
          <img src={require(`assets/icons/chains/${vault.chainId}.png`)} alt={network?.name} />
        </div>
      </Tooltip>
    </StyledVaultChainIcon>
  );
};

const TokenOption = ({ symbol, icon }: ITokenOptionProps) => {
  return (
    <div className="token-option-wrapper">
      <img src={icon} className="token-icon" alt="token icon" />
      <span>{symbol}</span>
    </div>
  );
};

export function TokenSelect({ vault, onSelect }: IProps) {
  const handleSelect = (e) => {
    onSelect(e.value);
  };

  const selectStyles = {
    menu: (provided) => ({
      ...provided,
      border: `1px solid ${Colors.turquoise}`,
      borderRadius: "unset",
    }),
    option: (provided, state) => ({
      ...provided,
      fontWeight: state.isSelected ? "bold" : "",
      backgroundColor: state.isSelected ? `${Colors.darkBlue}` : `${Colors.fieldBlue}`,
      color: state.isSelected ? `${Colors.turquoise}` : "",
      height: "60px",
      display: "flex",
      "&:hover": {
        opacity: "0.8",
      },
    }),
    control: () => ({
      border: `1px solid ${Colors.turquoise}`,
      display: "flex",
      color: `${Colors.white}`,
      height: "60px",
    }),
    menuList: () => ({
      padding: "unset",
    }),
  };

  const tokensOptions = vault.multipleVaults?.map((vault) => {
    return {
      value: vault.id,
      label: (
        <TokenOption
          symbol={`${vault.stakingTokenSymbol} (${vault.version})`}
          icon={ipfsTransformUri(vault.description?.["project-metadata"].tokenIcon)}
        />
      ),
    };
  });

  return (
    <div className="token-select-wrapper">
      {vault.multipleVaults ? (
        <Select
          defaultValue={tokensOptions?.[0]}
          components={{ IndicatorSeparator: () => null }}
          styles={selectStyles}
          isSearchable={false}
          className="select-tokens"
          onChange={handleSelect}
          options={tokensOptions}
        />
      ) : (
        <div className="token-icon-wrapper">
          <div className="icons-wrapper">
            <img
              src={ipfsTransformUri(vault.description?.["project-metadata"].tokenIcon)}
              className="token-icon"
              alt="token icon"
            />
            <VaultChainIcon vault={vault} />
          </div>
          {vault.stakingTokenSymbol}
        </div>
      )}
    </div>
  );
}
