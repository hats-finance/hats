import { useState } from "react";
import { StyledCollapsableTextContent } from "./styles";
import ArrowIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

export type CollapsableTextContentProps = {
  title: string;
  children: JSX.Element;
  noContentPadding?: boolean;
};

export const CollapsableTextContent = ({ title, children, noContentPadding = false }: CollapsableTextContentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledCollapsableTextContent isOpen={isOpen} noContentPadding={noContentPadding}>
      <div className="title-container" onClick={() => setIsOpen((prev) => !prev)}>
        <ArrowIcon className="arrow" />
        <p>{title}</p>
      </div>

      <div className="content-container">{children}</div>
    </StyledCollapsableTextContent>
  );
};
