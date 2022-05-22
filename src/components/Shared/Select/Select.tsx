import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { Colors } from "../../../constants/constants";
import "./index.scss";

interface IMultiSelectOption {
  label: string | number;
  value: string | number | undefined;
}

interface IProps {
  name?: string;
  value: string | number | undefined;
  options: IMultiSelectOption[];
  onChange: Function;
}

const customStyles = {
  indicatorsContainer: (provided, state) => ({
    ...provided,
    display: "none"
  }),
  control: (provided, state) => ({
    ...provided,
    border: "1px solid",
    color: `${Colors.turquoise}`,
    borderColor: Colors.turquoise,
    backgroundColor: `${Colors.darkBlue}`,
    borderRadius: "none"
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: `${Colors.turquoise}`
  }),
  input: (provided, state) => ({
    ...provided,
    color: `${Colors.turquoise}`
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: `${Colors.turquoise}`
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: "0px"
  }),
  option: (provided, state) => ({
    ...provided,
    border: "1px solid",
    color: `${Colors.turquoise}`,
    borderColor: Colors.turquoise,
    backgroundColor: `${Colors.darkBlue}`,
    minWidth: "unset",
    width: "100%"
  })
};

export default function Select(props: IProps) {
  const { options, name, onChange, value } = props;
  const [selectedValue, setSelectedValue] = useState<
    IMultiSelectOption | undefined
  >(undefined);

  useEffect(() => {
    let selectedValue = options.find((option) => value === option.value);
    setSelectedValue(selectedValue);
  }, [value, options]);

  const onSelectChange = (e) => {
    onChange({
      target: {
        name,
        value: e.value
      }
    });
  };

  return (
    <div className="react-select-container">
      <ReactSelect
        classNamePrefix="react-select"
        name={name}
        value={selectedValue}
        onChange={onSelectChange}
        styles={customStyles}
        options={options}
      />
    </div>
  );
}
