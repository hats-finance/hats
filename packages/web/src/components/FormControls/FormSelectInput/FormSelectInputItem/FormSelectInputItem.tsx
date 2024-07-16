import CheckboxCheckedIcon from "@mui/icons-material/CheckBox";
import CheckboxUncheckedIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import RadioCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { WithTooltip } from "components/WithTooltip/WithTooltip";
import { useMemo } from "react";
import { ipfsTransformUri } from "utils";
import { FormSelectInputOption } from "../FormSelectInput";
import { StyledFormSelectInputItem } from "./styles";

interface MenuItemProps {
  currentValue: string | string[];
  option: FormSelectInputOption;
  multiple: boolean;
  nonSelectable?: boolean;
  noSelectedMark?: boolean;
  handleSelectedItem: (val: string) => void;
  handleUnselectedItem: (val: string) => void;
}

const FormSelectInputItem = ({
  currentValue,
  option,
  handleSelectedItem,
  handleUnselectedItem,
  multiple,
  nonSelectable = false,
  noSelectedMark = false,
}: MenuItemProps) => {
  const isChecked = useMemo(
    () => (multiple ? (currentValue as string[])?.indexOf(option.value) > -1 : (currentValue as string) === option.value),
    [currentValue, multiple, option]
  );

  const handleOnChange = () => {
    if (isChecked) {
      handleUnselectedItem(option.value);
    } else {
      handleSelectedItem(option.value);
    }
  };

  const getIcon = () => {
    if (multiple) {
      if (isChecked) return <CheckboxCheckedIcon />;
      return <CheckboxUncheckedIcon />;
    } else {
      if (isChecked) return <RadioCheckedIcon />;
      return <RadioUncheckedIcon />;
    }
  };

  return (
    <StyledFormSelectInputItem htmlFor={`option-${option.value}`} noSelectedMark={noSelectedMark}>
      <WithTooltip text={option.onHoverText}>
        <div className="info">
          {option.icon && <img src={ipfsTransformUri(option.icon)} alt="logo" />}
          <div className="text">
            <span>{option.label || "---"}</span>
            <span
              className="helper"
              onClick={(e) => {
                e.preventDefault();
                if (option.onHelperClick) option.onHelperClick();
              }}
            >
              {option.helper}
            </span>
          </div>
        </div>
      </WithTooltip>
      {!nonSelectable && (
        <>
          {!noSelectedMark && getIcon()}
          <input
            id={`option-${option.value}`}
            checked={isChecked}
            onChange={handleOnChange}
            type={multiple ? "checkbox" : "radio"}
          />
        </>
      )}
    </StyledFormSelectInputItem>
  );
};

export { FormSelectInputItem };
