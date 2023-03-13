import { forwardRef } from "react";
import { StyledFormPgpPublicKeyInput } from "./styles";
import { useTranslation } from "react-i18next";
import { parseIsDirty } from "../utils";
import useModal from "hooks/useModal";
import { PgpPublicKeyInputModal } from "./PgpPublicKeyInputModal";

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
  const { isShowing: isShowingPgpKeyInput, show: showPgpKeyInput, hide: hidePgpKeyInput } = useModal();

  const getPgpKeyResumed = (pgpKey: string) => {
    const keyBeggining = pgpKey.split("-----BEGIN PGP PUBLIC KEY BLOCK-----")[1]?.trim();
    return keyBeggining ? `${keyBeggining?.slice(0, 50)}...` : t("invalidPgpKeyPleaseSelectNewOne");
  };

  return (
    <StyledFormPgpPublicKeyInput
      disabled={disabled}
      hasError={!!error && colorable}
      isDirty={parseIsDirty(isDirty) && colorable}
      noMargin={noMargin}
    >
      <div className="select-button" onClick={!disabled ? showPgpKeyInput : () => {}}>
        <label>{label ?? t("pgpPublicKey")}</label>
        {value ? (
          <p className="value">{getPgpKeyResumed(value)}</p>
        ) : (
          <p className="placeholder">{placeholder ?? t("addPgpPublicKey")}</p>
        )}
      </div>

      {error && <span className="error">{error.message}</span>}

      <PgpPublicKeyInputModal
        key={name}
        isShowing={isShowingPgpKeyInput}
        onHide={hidePgpKeyInput}
        onPgpKeySelected={onChange}
        notAllowedKeys={notAllowedKeys}
        ref={ref}
      />
    </StyledFormPgpPublicKeyInput>
  );
}

export const FormPgpPublicKeyInput = forwardRef(FormPgpPublicKeyInputComponent);
