import Select from 'react-select';
import { Colors } from 'constants/constants';
import { IVault } from "types/types";
import "./index.scss";
import { ipfsTransformUri } from 'utils';

interface IProps {
  vault: IVault
  onSelect: (pid: string) => void;
}

interface ITokenOptionProps {
  symbol: string;
  icon: string | undefined;
}

const TokenOption = ({ symbol, icon }: ITokenOptionProps) => {
  return (
    <div className="token-option-wrapper">
      <img src={icon} className="token-icon" alt="token icon" />
      <span>{symbol}</span>
    </div>
  )
}

export default function TokenSelect({ vault, onSelect }: IProps) {

  const handleSelect = (e) => {
    onSelect(e.value);
  }

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
      }
    }),
    control: () => ({
      border: `1px solid ${Colors.turquoise}`,
      display: "flex",
      color: `${Colors.white}`,
      height: "60px",
    }),
    menuList: () => ({
      padding: "unset",
    })
  }

  const tokensOptions = vault.multipleVaults?.map(vault => {
    return (
      {
        value: vault.pid,
        label: <TokenOption symbol={vault.stakingTokenSymbol} icon={ipfsTransformUri(vault.description?.["project-metadata"].tokenIcon)} />
      }
    )
  })

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
          options={tokensOptions} />
      ) : (
        <div className="token-icon-wrapper">
          <img src={ipfsTransformUri(vault.description?.["project-metadata"].tokenIcon)} className="token-icon" alt="token icon" />
          {vault.stakingTokenSymbol}
        </div>
      )}
    </div>
  )
}
