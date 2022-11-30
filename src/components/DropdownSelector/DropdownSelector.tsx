import { useElementOutsideScrreen } from "hooks/useElementOutsideScreen";
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
  const isOutsideScreen = useElementOutsideScrreen(optionsRef, show);

  useOnClickOutside(optionsRef, () => onClose());

  return (
    <StyledDropdownSelector show={show} isOutsideScreen={isOutsideScreen}>
      <div className="overlay" />
      <div className="options" ref={optionsRef}>
        {options.map((opt) => {
          const onClick = () => {
            onClose();
            opt.onClick();
          };

          return (
            <div className="option" key={opt.label} onClick={onClick}>
              {opt.icon && <img src={opt.icon} alt={opt.label} />}
              <span>{opt.label}</span>
            </div>
          );
        })}
      </div>
    </StyledDropdownSelector>
  );
};
