import { useTranslation } from "react-i18next";
import { StyledAlert } from "./styles";
import WarningIcon from "@mui/icons-material/EmojiObjectsTwoTone";
import CheckIcon from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/InfoOutlined";

export type AlertProps = {
  type: "warning" | "error" | "success" | "info";
  content?: string;
  children?: JSX.Element;
  button?: JSX.Element;
  className?: string;
};

export const Alert = ({ type, content, children, button, ...props }: AlertProps) => {
  const { t } = useTranslation();

  const getAlertIcon = () => {
    switch (type) {
      case "error":
      case "warning":
        return <WarningIcon />;
      case "success":
        return <CheckIcon />;
      case "info":
        return <InfoIcon />;
    }
  };

  const getAlertTitle = () => {
    switch (type) {
      case "error":
        return t("error");
      case "warning":
        return t("note");
      case "success":
        return t("note");
      case "info":
        return t("info");
    }
  };

  return (
    <StyledAlert type={type} {...props}>
      <div className="icon-container">
        <div className="icon">{getAlertIcon()}</div> <span>{getAlertTitle()}</span>
      </div>
      {content && <div className="alert-content" dangerouslySetInnerHTML={{ __html: content }} />}
      {children && <div className="alert-content">{children}</div>}
      {button}
    </StyledAlert>
  );
};
