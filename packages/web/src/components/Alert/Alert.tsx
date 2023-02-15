import { useTranslation } from "react-i18next";
import { StyledAlert } from "./styles";
import WarningIcon from "@mui/icons-material/EmojiObjectsTwoTone";
import CheckIcon from "@mui/icons-material/Check";

export type AlertProps = {
  type: "warning" | "error" | "success";
  content: string;
};

export const Alert = ({ type, content }: AlertProps) => {
  const { t } = useTranslation();

  const getAlertIcon = () => {
    switch (type) {
      case "error":
      case "warning":
        return <WarningIcon />;
      case "success":
        return <CheckIcon />;
    }
  };

  const getAlertTitle = () => {
    switch (type) {
      case "error":
      case "warning":
        return t("note");
      case "success":
        return t("note");
    }
  };

  return (
    <StyledAlert type={type}>
      <div className="icon-container">
        <div className="icon">{getAlertIcon()}</div> <span>{getAlertTitle()}</span>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
    </StyledAlert>
  );
};
