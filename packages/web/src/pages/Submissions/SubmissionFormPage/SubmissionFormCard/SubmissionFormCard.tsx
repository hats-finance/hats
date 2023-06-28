import ArrowIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CheckmarkIcon from "@mui/icons-material/CheckOutlined";
import { SubmissionFormContext } from "pages/Submissions/SubmissionFormPage/store";
import React, { useContext } from "react";
import { StyledSubmissionFormCard } from "./styles";

interface SubmissionFormCardProps {
  id: number;
  title: string;
  verified: boolean;
  children: React.ReactNode;
  disabled: boolean;
  extraInfoTitle?: string;
  collapsed: boolean;
}

export default function SubmissionFormCard({
  id,
  title,
  verified,
  children,
  disabled,
  extraInfoTitle,
  collapsed,
}: SubmissionFormCardProps) {
  const { setCurrentStep } = useContext(SubmissionFormContext);

  return (
    <StyledSubmissionFormCard isVerified={verified} isDisabled={disabled} isCollapsed={collapsed}>
      <div className="card-header" onClick={() => setCurrentStep(id)}>
        <span className="card-number">{verified ? <CheckmarkIcon /> : id + 1}</span>
        <span className="card-title">{title}</span>
        {extraInfoTitle && <span>{`(${extraInfoTitle})`}</span>}
        <div className="card-arrow">
          <ArrowIcon fontSize="small" />
        </div>
      </div>

      <div className="card-body">{children}</div>
    </StyledSubmissionFormCard>
  );
}
