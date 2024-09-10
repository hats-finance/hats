import DropdownArrow from "@mui/icons-material/KeyboardArrowDownOutlined";
import useOnClickOutside from "hooks/useOnClickOutside";
import React, { forwardRef, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { parseIsDirty } from "../utils";
import { FormSelectInputItem } from "./FormSelectInputItem/FormSelectInputItem";
import { SelectButton, SelectMenuOptions, StyledFormSelectInput } from "./styles";

export interface FormSelectInputOption {
  label: string;
  value: string;
  helper?: JSX.Element;
  onHelperClick?: Function;
  icon?: string;
  onHoverText?: string;
}

interface FormSelectInputProps {
  name?: string;
  label?: string;
  helper?: string;
  placeholder?: string;
  emptyState?: string;
  multiple?: boolean;
  colorable?: boolean;
  disabled?: boolean;
  noMargin?: boolean;
  readOnly?: boolean;
  flexExpand?: boolean;
  noSelectedMark?: boolean;
  smallPadding?: boolean;
  isDirty?: boolean | boolean[];
  value: string | string[];
  onChange?: (data: string | string[]) => void;
  options: FormSelectInputOption[];
  error?: { message?: string; type: string };
}

export function FormSelectInputComponent(
  {
    value,
    onChange,
    options,
    name,
    multiple = false,
    colorable = false,
    disabled = false,
    isDirty = false,
    readOnly = false,
    flexExpand = false,
    noMargin = false,
    smallPadding = false,
    noSelectedMark = false,
    emptyState,
    error,
    helper,
    placeholder,
    label,
  }: FormSelectInputProps,
  ref
) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setOpen(false));

  const handleSelectedItem = (val: string) => {
    const newValue = multiple ? [...(value as string[]), val] : val;

    if (multiple) (newValue as string[]).sort();

    if (onChange) onChange(newValue);
    if (!multiple) setOpen(false);
  };

  const handleUnselectedItem = (val: string) => {
    if (!multiple) return;
    const newValue = multiple ? (value as string[]).filter((v) => v !== val) : value;

    if (multiple) (newValue as string[]).sort();

    if (onChange) onChange(newValue);
  };

  const handleOpenDropdown = (event: React.FormEvent) => {
    event.preventDefault();
    setOpen((lastState) => !lastState);
  };

  const getRenderValue = () => {
    if ((!value || value.length === 0) && placeholder) return placeholder;
    return multiple
      ? `${(value as string[]).length} selected`
      : (options ?? []).find((o) => o.value === (value as string))?.label;
  };

  return (
    <StyledFormSelectInput ref={menuRef} noMargin={noMargin} flexExpand={flexExpand}>
      {label && <label className="input-label">{label}</label>}

      <SelectButton
        disabled={disabled}
        onClick={disabled || readOnly ? undefined : handleOpenDropdown}
        isDirty={parseIsDirty(isDirty) && colorable}
        hasError={!!error && colorable}
        isFilled={!!value}
        isOpen={isOpen}
        readOnly={readOnly}
        smallPadding={smallPadding}
        noLabel={!label}
      >
        <span className="text">{getRenderValue()}</span>
        <span className="icon">
          <DropdownArrow />
        </span>
      </SelectButton>

      {error && <span className="error">{error.message}</span>}

      {isOpen && (
        <SelectMenuOptions>
          {options.length === 0 && (
            <FormSelectInputItem
              key={`empty`}
              option={{ label: emptyState ?? t("noOptions"), value: "" }}
              nonSelectable
              currentValue={value}
              multiple={multiple}
              handleUnselectedItem={handleUnselectedItem}
              handleSelectedItem={handleSelectedItem}
              noSelectedMark={noSelectedMark}
            />
          )}

          {options.map((option) => {
            return (
              <FormSelectInputItem
                key={`${name}-${option.value}`}
                option={option}
                currentValue={value}
                multiple={multiple}
                handleUnselectedItem={handleUnselectedItem}
                handleSelectedItem={handleSelectedItem}
                noSelectedMark={noSelectedMark}
              />
            );
          })}
        </SelectMenuOptions>
      )}
      {!error && helper && <span className="helper">{helper}</span>}
    </StyledFormSelectInput>
  );
}

export const FormSelectInput = forwardRef(FormSelectInputComponent);
