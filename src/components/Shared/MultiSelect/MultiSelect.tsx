import { useEffect, useState } from "react";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { Colors } from "../../../constants/constants";
import "./index.scss";

interface IMultiSelectOption {
  label: string | number;
  value: string | number;
}

interface IProps {
  name: string;
  value: Array<string | number>;
  options: IMultiSelectOption[];
  onChange: Function;
}

const customStyles = {
  indicatorsContainer: (provided, state) => ({
    ...provided,
    display: 'none'
  }),
  control: (provided, state) => ({
    ...provided,
    display: 'none'
  }),
  option: (provided, state) => ({
    ...provided,
    border: '1px solid',
    color: `${Colors.turquoise} !important`,
    borderColor: Colors.turquoise,
    backgroundColor: `${Colors.darkBlue} !important`,
    minWidth: 'unset',
    width: '100%'
  }),
}

export default function MultiSelect(props: IProps) {
  const { options, name, onChange, value } = props;
  const [selectedValue, setSelectedValue] = useState<IMultiSelectOption[]>([]);

  useEffect(() => {
    let selectedValue = options.filter((option) => value.includes(option.value))
    setSelectedValue(selectedValue);
  }, [value, options])

  const onSelectChange = (e) => {
    onChange({
      target: {
        name,
        value: e.map(item => item.value)
      },
    })
  }

  return (
    <div className="multi-select">
      <ReactMultiSelectCheckboxes
        name={name}
        value={selectedValue}
        onChange={onSelectChange}
        styles={customStyles}
        options={options}
      />
    </div>
  );
}
