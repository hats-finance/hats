import { forwardRef } from "react";
import { Button } from "components";
import { useKeystore } from "components/Keystore";
import { useTranslation } from "react-i18next";
import { parseIsDirty } from "../utils";
import { StyledFormPgpPublicKeyInput } from "./styles";
import KeyIcon from "@mui/icons-material/KeyOutlined";

interface FormPgpPublicKeyInputProps {
  label?: string;
  name?: string;
  placeholder?: string;
  colorable?: boolean;
  noMargin?: boolean;
  isDirty?: boolean;
  disabled?: boolean;
  value: string;
  notAllowedKeys?: string[];
  onChange: (data: string) => void;
  error?: { message: string; type: string };
}

export function FormPgpPublicKeyInputComponent(
  {
    value,
    onChange,
    name,
    colorable = false,
    isDirty = false,
    noMargin = false,
    disabled = false,
    notAllowedKeys = [],
    error,
    placeholder,
    label,
  }: FormPgpPublicKeyInputProps,
  ref
) {
  const { t } = useTranslation();
  const { selectPublicKey } = useKeystore();

  const getPgpKeyResumed = (pgpKey: string) => {
    const keyBeggining = pgpKey.split("-----BEGIN PGP PUBLIC KEY BLOCK-----")[1]?.trim();
    return keyBeggining ? `${keyBeggining?.slice(0, 40)}...` : t("invalidPgpKeyPleaseSelectNewOne");
  };

  const handleOpenPgpSelector = async () => {
    const selectedKey = await selectPublicKey();
    if (!selectedKey) return;

    if (notAllowedKeys.includes(selectedKey)) return alert(t("keyAlreadyAdded"));
    if (selectedKey) onChange(selectedKey);
  };

  return (
    <StyledFormPgpPublicKeyInput
      disabled={disabled}
      hasError={!!error && colorable}
      isDirty={parseIsDirty(isDirty) && colorable}
      noMargin={noMargin}
    >
      <div className="container" key={name}>
        <div className="select-button" onClick={!disabled ? handleOpenPgpSelector : () => {}}>
          <label>{label ?? t("pgpPublicKey")}</label>
          {value ? (
            <p className="value">{getPgpKeyResumed(value)}</p>
          ) : (
            <p className="placeholder">{placeholder ?? t("addPgpPublicKey")}</p>
          )}
        </div>

        <Button styleType="invisible" onClick={!disabled ? handleOpenPgpSelector : () => {}}>
          <KeyIcon className="mr-2" />
          <span>{t("pgpTool")}</span>
        </Button>
      </div>

      {error && <span className="error">{error.message}</span>}
    </StyledFormPgpPublicKeyInput>
  );
}

export const FormPgpPublicKeyInput = forwardRef(FormPgpPublicKeyInputComponent);
