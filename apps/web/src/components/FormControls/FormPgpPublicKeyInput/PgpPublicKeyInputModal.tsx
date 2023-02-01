import { forwardRef, useContext, useRef, useState } from "react";
import { readKey } from "openpgp";
import { useTranslation } from "react-i18next";
import { Button, FormInput, Modal } from "components";
import { KeyManager, KeystoreContext } from "components/Keystore";
import { StyledPgpPublicKeyInputModal } from "./styles";

type PgpPublicKeyInputModalProps = {
  isShowing: boolean;
  onHide: () => void;
  onPgpKeySelected: (pgpKey: string) => void;
  notAllowedKeys: string[];
  ref: any;
};

const PgpPublicKeyInputModalComponent = (
  { isShowing, onHide, onPgpKeySelected, notAllowedKeys }: PgpPublicKeyInputModalProps,
  ref
) => {
  const { t } = useTranslation();
  const localRef = useRef<HTMLInputElement>();
  const keystoreContext = useContext(KeystoreContext);

  const [publicPgpKey, setPublicPgpKey] = useState<string>();
  const [pgpError, setPgpError] = useState<string>();

  const addPublicKey = async (pgpKey: string | undefined) => {
    setPgpError(undefined);

    if (pgpKey) {
      try {
        await readKey({ armoredKey: pgpKey });
        if (notAllowedKeys.includes(pgpKey)) {
          throw new Error(t("keyAlreadyAdded"));
        }

        onHide();
        setPublicPgpKey(undefined);
        setPgpError(undefined);
        if (localRef.current) localRef.current!.value = "";

        onPgpKeySelected(pgpKey);
        keystoreContext.setSelectedAlias("");
      } catch (error: any) {
        setPgpError(error.message);
      }
    } else {
      setPgpError(t("required"));
    }
  };

  const setRef = (r: any) => {
    if (ref && typeof ref === "function") ref(r);
    localRef.current = r;
  };

  return (
    <Modal isShowing={isShowing} title={t("createPgpKey")} onHide={onHide} withTitleDivider>
      <StyledPgpPublicKeyInputModal>
        <p className="description">{t("VaultEditor.pgp-key-description")}</p>

        <KeyManager
          onSelectedKey={(selectedKey) => {
            if (selectedKey) {
              setPgpError(undefined);
              setPublicPgpKey(selectedKey.publicKey);
              localRef.current!.value = selectedKey.publicKey;
            }
          }}
        />
        <hr />

        <p className="description">{t("VaultEditor.pgp-key-alternative")}</p>
        <FormInput
          ref={setRef}
          label={t("VaultEditor.pgp-key")}
          error={pgpError ? { message: pgpError, type: "error" } : undefined}
          type="textarea"
          colorable
          onChange={(e) => setPublicPgpKey(e.target.value)}
          placeholder={t("VaultEditor.pgp-key-placeholder")}
        />

        <Button expanded onClick={() => addPublicKey(publicPgpKey)}>
          {t("VaultEditor.add-pgp")}
        </Button>
      </StyledPgpPublicKeyInputModal>
    </Modal>
  );
};

export const PgpPublicKeyInputModal = forwardRef(PgpPublicKeyInputModalComponent);
