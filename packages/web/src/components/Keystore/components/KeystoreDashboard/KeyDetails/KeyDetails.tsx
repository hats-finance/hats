import { useTranslation } from "react-i18next";
import { CollapsableTextContent, FormInput, Modal } from "components";
import { IStoredKey } from "../../../types";
import { StyledBaseKeystoreContainer } from "../../../styles";
import DetailsIcon from "@mui/icons-material/FindInPageOutlined";

type KeyDetailsProps = {
  pgpKey: IStoredKey;
  onClose: () => void;
};

export const KeyDetails = ({ pgpKey, onClose }: KeyDetailsProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      removeAnimation
      titleIcon={<DetailsIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.keyDetails")}
      newStyles
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer>
        <p className="mb-5">{t("PGPTool.keyDetailsDescription")}</p>

        <FormInput value={pgpKey.alias} label={t("PGPTool.keyNameAlias")} readOnly />

        <div className="mb-4">
          <CollapsableTextContent noContentPadding title={t("PGPTool.privateKey")}>
            <FormInput
              selectAllOnClick
              rows={16}
              value={pgpKey.privateKey}
              label={t("PGPTool.privateKey")}
              readOnly
              type="textarea"
            />
          </CollapsableTextContent>
        </div>

        {pgpKey.passphrase && (
          <div className="mb-4">
            <CollapsableTextContent noContentPadding title={t("PGPTool.passphrase")}>
              <FormInput selectAllOnClick value={pgpKey.passphrase} label={t("PGPTool.passphrase")} readOnly />
            </CollapsableTextContent>
          </div>
        )}

        <div className="mb-4">
          <CollapsableTextContent noContentPadding title={t("PGPTool.publicKey")}>
            <FormInput selectAllOnClick value={pgpKey.publicKey} label={t("PGPTool.publicKey")} readOnly type="textarea" />
          </CollapsableTextContent>
        </div>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
