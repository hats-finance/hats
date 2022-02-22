import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { Colors } from "../../../constants/constants";
import "./index.scss";

interface IMultiSelectOption {
  label: string | number;
  value: string | number;
}

interface IProps {
  options: IMultiSelectOption[];
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

export default function Countdown(props: IProps) {
  const { options } = props;

  return (
    <div className="multi-select">
      <ReactMultiSelectCheckboxes styles={customStyles} options={options} />
    </div>
  );
}
