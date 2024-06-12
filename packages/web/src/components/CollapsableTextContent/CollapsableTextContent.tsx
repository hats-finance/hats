import ArrowIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useState } from "react";
import { StyledCollapsableTextContent } from "./styles";

export type CollapsableTextContentProps = {
  title: string;
  children: JSX.Element;
  noContentPadding?: boolean;
  inverseArrow?: boolean;
};

export const CollapsableTextContent = ({
  title,
  children,
  noContentPadding = false,
  inverseArrow = false,
}: CollapsableTextContentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledCollapsableTextContent isOpen={isOpen} noContentPadding={noContentPadding} inverseArrow={inverseArrow}>
      <div className="title-container" onClick={() => setIsOpen((prev) => !prev)}>
        <ArrowIcon className="arrow" />
        <p>{title}</p>
      </div>

      <div className="content-container">{children}</div>
    </StyledCollapsableTextContent>
  );
};
