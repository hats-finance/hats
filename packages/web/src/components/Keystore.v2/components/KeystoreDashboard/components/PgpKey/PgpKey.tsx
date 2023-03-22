import Identicon from "react-identicons";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { WithTooltip } from "components";
import { IStoredKey } from "../../../../types";
import { StyledKey } from "./styles";

import ViewIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";

type PgpKeyProps = {
  pgpKey?: IStoredKey;
  onSelectedDetails?: () => void;
  onSelectedDelete?: () => void;
  viewOnly?: boolean;
};

export const PgpKey = ({ pgpKey, onSelectedDetails, onSelectedDelete, viewOnly = false }: PgpKeyProps) => {
  const { t } = useTranslation();

  const id = pgpKey?.id ?? pgpKey?.alias;

  return (
    <StyledKey noSelectable={!pgpKey} viewOnly={viewOnly}>
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
        </div>
      )}
    </StyledKey>
  );
};
