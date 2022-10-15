import React, { forwardRef, useRef, useState } from "react";
import useOnClickOutside from "hooks/useOnClickOutside";
import { ReactComponent as DropdownArrow } from "assets/icons/down-arrow.icon.svg";
import { FormSelectInputItem } from "./FormSelectInputItem/FormSelectInputItem";
import { FormSelectInputOption } from "./types";
import { SelectButton, SelectMenuOptions, StyledFormSelectInput } from "./styles";

interface FormSelectInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  colorable?: boolean;
  value: string | string[];
  onChange: (event: Partial<React.ChangeEvent<any>>) => void;
  options: FormSelectInputOption[];
}

export function FormSelectInputComponent(
  { value, onChange, options, name, multiple = false, colorable = false, placeholder, label }: FormSelectInputProps,
  ref
) {
  const [isOpen, setOpen] = useState(false);
  const [changed, setChanged] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setOpen(false));

  const handleSelectedItem = (val: string) => {
    const newValue = multiple ? [...(value as string[]), val] : val;

    onChange({ target: { name, value: newValue } });
    if (!changed) setChanged(true);
    if (!multiple) setOpen(false);
  };

  const handleUnselectedItem = (val: string) => {
    if (!multiple) return;
    const newValue = multiple ? (value as string[]).filter((v) => v !== val) : value;

    onChange({ target: { name, value: newValue } });
    if (!changed) setChanged(true);
  };

  const handleOpenDropdown = (event: React.FormEvent) => {
    event.preventDefault();
    setOpen((lastState) => !lastState);
  };

  const getRenderValue = () => {
    if ((!value || value.length === 0) && placeholder) return placeholder;
    return multiple ? `${(value as string[]).length} selected` : options.find((o) => o.value === (value as string))?.label;
  };

  return (
    <StyledFormSelectInput ref={menuRef}>
      {label && <label>{label}</label>}
      <SelectButton onClick={handleOpenDropdown} isChanged={changed && colorable} isOpen={isOpen}>
        <span className="text">{getRenderValue()}</span>
        <span className="icon">
          <DropdownArrow />
        </span>
      </SelectButton>

      {isOpen && (
        <SelectMenuOptions>
          {options.map((option) => {
            return (
              <FormSelectInputItem
                key={option.value}
                option={option}
                currentValue={value}
                multiple={multiple}
                handleUnselectedItem={handleUnselectedItem}
                handleSelectedItem={handleSelectedItem}
              />
            );
          })}
        </SelectMenuOptions>
      )}
    </StyledFormSelectInput>
  );
}

export const FormSelectInput = forwardRef(FormSelectInputComponent);
