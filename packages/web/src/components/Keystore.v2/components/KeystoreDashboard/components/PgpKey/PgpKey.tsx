import Identicon from "react-identicons";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { WithTooltip } from "components";
import { IStoredKey } from "../../../../types";
import { StyledKey } from "./styles";

import ViewIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import CheckIcon from "@mui/icons-material/CheckOutlined";

type PgpKeyProps = {
  pgpKey?: IStoredKey;
  onSelectedDetails?: () => void;
  onSelectedDelete?: () => void;
  onClick?: () => void;
  viewOnly?: boolean;
  selected?: boolean;
};

export const PgpKey = ({
  pgpKey,
  onSelectedDetails,
  onSelectedDelete,
  onClick,
  viewOnly = false,
  selected = false,
}: PgpKeyProps) => {
  const { t } = useTranslation();

  const id = pgpKey?.id ?? pgpKey?.alias;

  return (
    <StyledKey onClick={onClick} noSelectable={!pgpKey} viewOnly={viewOnly} selected={selected}>
      {pgpKey ? (
        <div className="info">
          <Identicon string={id} size={24} bg="#fff" />
          <div className="text">
            <p>{pgpKey.alias}</p>
            {pgpKey.createdAt && <p className="createdAt">{moment(pgpKey.createdAt).fromNow()}</p>}
          </div>
        </div>
      ) : (
        <div className="info">
          <CloseIcon color="error" />
          <p>{t("PGPTool.noKeysInStore")}</p>
        </div>
      )}

      {pgpKey && !viewOnly && (
        <div className="actions">
          <WithTooltip placement="left" text={t("PGPTool.viewKeyDetails")}>
            <div onClick={onSelectedDetails}>
              <ViewIcon className="icon" fontSize="inherit" />
            </div>
          </WithTooltip>
          <WithTooltip placement="right" text={t("PGPTool.deleteKey")}>
            <div onClick={onSelectedDelete}>
              <DeleteIcon className="icon" fontSize="inherit" />
            </div>
          </WithTooltip>
          {selected && (
            <WithTooltip placement="right" text={t("PGPTool.deleteKey")}>
              <div className="ml-2">
                <CheckIcon className="icon-selected" fontSize="inherit" />
              </div>
            </WithTooltip>
          )}
        </div>
      )}
    </StyledKey>
  );
};
