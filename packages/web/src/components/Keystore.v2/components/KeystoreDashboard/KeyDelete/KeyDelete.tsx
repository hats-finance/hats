import { useTranslation } from "react-i18next";
import { Button, Modal } from "components";
import { useKeystore } from "../../../KeystoreProvider";
import { IStoredKey } from "../../../types";
import { StyledBaseKeystoreContainer } from "../../../styles";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { PgpKey } from "../components";

type KeyDeleteProps = {
  pgpKey: IStoredKey;
  onClose: () => void;
};

export const KeyDelete = ({ pgpKey, onClose }: KeyDeleteProps) => {
  const { t } = useTranslation();

  const { setKeystore } = useKeystore();

  const handleDeleteKey = () => {
    setKeystore((prev) => ({ ...prev, storedKeys: [...prev!.storedKeys.filter((key) => key.id !== pgpKey.id)] }));
    onClose();
  };

  return (
    <Modal
      titleIcon={<RemoveIcon className="mr-2" fontSize="large" />}
      title={t("PGPTool.deleteKey")}
      pgpKeystoreStyles
      capitalizeTitle
      isShowing={true}
      onHide={onClose}
    >
      <StyledBaseKeystoreContainer>
        <p className="mb-5">{t("PGPTool.deleteKeyDescription")}</p>
        <PgpKey pgpKey={pgpKey} viewOnly />

        <div className="buttons-row mt-5">
          <Button styleType="outlined" expanded onClick={onClose}>
            {t("no")}
          </Button>
          <Button styleType="filled" expanded onClick={handleDeleteKey}>
            {t("yes")}
          </Button>
        </div>
      </StyledBaseKeystoreContainer>
    </Modal>
  );
};
