import { useMemo } from "react";
import { FormSelectInputOption } from "../types";
import { StyledFormSelectInputItem } from "./styles";

interface MenuItemProps {
  currentValue: string | string[];
  option: FormSelectInputOption;
  multiple: boolean;
  handleSelectedItem: (val: string) => void;
  handleUnselectedItem: (val: string) => void;
}

const FormSelectInputItem = ({ currentValue, option, handleSelectedItem, handleUnselectedItem, multiple }: MenuItemProps) => {
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

  return (
    <StyledFormSelectInputItem htmlFor={`option-${option.value}`}>
      <input id={`option-${option.value}`} checked={isChecked} onChange={handleOnChange} type={multiple ? 'checkbox' : 'radio'} />
      <span>{option.label || '---'}</span>
    </StyledFormSelectInputItem>
  );
};

export { FormSelectInputItem };
