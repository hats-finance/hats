import React, { useRef } from "react";
import classes from "./customMultiselect.style.module.scss";
import { ReactComponent as DropdownArrow } from "assets/icons/down-arrow.icon.svg";
import useOnClickOutside from "hooks/useOnClickOutside";

type Option = {
  label: string;
  value: string | number;
};

export type MultiselectOptions = Array<Option>;

interface CustomMultiselectProps {
  value: Array<string | number>;
  onChange: (value: Array<string | number>) => void;
  options: MultiselectOptions;
}

export default function CustomMultiSelect({
  value,
  onChange,
  options
}: CustomMultiselectProps) {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [hasChanged, setChanged] = React.useState<boolean>(false);

  //for handaling closing menu on click outside
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setOpen(false));

  function handleAddingItemToLocalValue(item: string | number) {
    onChange([...value, item]);
    if (!hasChanged) {
      setChanged(true);
    }
  }

  function handleRemoveItemFromLocalValue(item: string | number) {
    onChange(value.filter((stateItem) => stateItem !== item));
    if (!hasChanged) {
      setChanged(true);
    }
  }

  function toggleDropdown() {
    setOpen((lastState) => !lastState);
  }

  return (
    <div ref={menuRef} className={classes.Root}>
      <button
        onClick={toggleDropdown}
        className={`${classes.Button} ${hasChanged ? classes.Changed : ""}`}
      >
        <span className={classes.ButtonText}>{`${value.length} selected`}</span>
        <span className={classes.ButtonIcon}>
          <DropdownArrow
            className={isOpen ? classes.Rotate : ""}
            width="10"
            height="8"
          />
        </span>
      </button>
      {isOpen && (
        <div className={classes.MenuContainer}>
          {options.map((option) => {
            return (
              <MenuItem
                value={value}
                key={option.label}
                handleRemoveItemFromLocalValue={handleRemoveItemFromLocalValue}
                handleAddingItemToLocalValue={handleAddingItemToLocalValue}
                option={option}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  value: Array<string | number>;
  option: Option;
  handleRemoveItemFromLocalValue: (item: string | number) => void;
  handleAddingItemToLocalValue: (item: string | number) => void;
}

function MenuItem({
  value,
  option,
  handleRemoveItemFromLocalValue,
  handleAddingItemToLocalValue
}: MenuItemProps) {
  const [checked, setCheked] = React.useState<boolean>(
    value.filter((item: string | number) => item === option.value).length > 0
  );

  return (
    <div className={classes.MenuItem}>
      <span>
        <input
          checked={checked}
          onChange={() => {
            setCheked((laseState) => !laseState);
            if (checked) {
              handleRemoveItemFromLocalValue(option.value);
            } else {
              handleAddingItemToLocalValue(option.value);
            }
          }}
          type="checkbox"
        />
      </span>
      <span>{option.label}</span>
    </div>
  );
}
