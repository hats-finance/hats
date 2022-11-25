import useOnClickOutside from "hooks/useOnClickOutside";
import { useRef } from "react";
import { StyledDropdownSelector } from "./styles";

type DropdownSelectorProps = {
  options: { icon?: string; label: string; onClick: Function }[];
  show: boolean;
  onClose: Function;
};

export const DropdownSelector = ({ options, show, onClose }: DropdownSelectorProps) => {
  const optionsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(optionsRef, () => onClose());

  return show ? (
    <StyledDropdownSelector ref={optionsRef}>
      {options.map((opt) => {
        const onClick = () => {
          onClose();
          opt.onClick();
        };

        return (
          <div className="option" key={opt.label} onClick={onClick}>
            {opt.icon && <img src={require(`assets/${opt.icon}`)} alt={opt.label} />}
            <span>{opt.label}</span>
          </div>
        );
      })}
    </StyledDropdownSelector>
  ) : null;
};
