import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { ipfsTransformUri } from "utils";
import { fixObject } from "hooks/useVaults";
import { Loading } from "components";
import {
  ContractsCoveredList,
  VaultDetailsForm,
  CommitteeDetailsForm,
  CommitteeMembersList,
  VaultFormReview,
  CommunicationChannelForm,
} from ".";
import { FormProvider, useForm } from "react-hook-form";
import { IEditedVaultDescription } from "./types";
import { uploadVaultDescription } from "./vaultService";
import { descriptionToEdit, editedToDescription, newVaultDescription } from "./utils";
import "./index.scss";
import { IVaultDescription } from "types/types";

const VaultEditorFormPage = () => {
  const { t } = useTranslation();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loadingFromIpfs, setLoadingFromIpfs] = useState<boolean>(false);
  const [savingToIpfs, setSavingToIpfs] = useState(false);
  const [ipfsDate, setIpfsDate] = useState<Date | undefined>();
  const { ipfsHash } = useParams();
  const methods = useForm<IEditedVaultDescription>({ defaultValues: newVaultDescription });
  const { handleSubmit, formState, reset, getValues } = methods;

  async function loadFromIpfs(ipfsHash: string) {
    try {
      setLoadingFromIpfs(true);
      const response = await fetch(ipfsTransformUri(ipfsHash));
      const lastModified = response.headers.get("last-modified");
      if (lastModified) {
        setIpfsDate(new Date(lastModified));
      }
      const newVaultDescription = await response.json();
      reset(descriptionToEdit(fixObject(newVaultDescription)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFromIpfs(false);
    }
  }

  useEffect(() => {
    if (ipfsHash) {
      (async () => {
        await loadFromIpfs(ipfsHash);
      })();
    } else {
      // convert severities of vault description to contracts state variable
      //severitiesToContracts(vaultDescription);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipfsHash]);

  async function saveToIpfs(vaultDescription: IVaultDescription) {
    try {
      setSavingToIpfs(true);
      await uploadVaultDescription(vaultDescription);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingToIpfs(false);
    }
  }

  // Pagination in mobile
  function nextPage() {
    if (pageNumber >= 5) return;
    setPageNumber(pageNumber + 1);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  function previousPage() {
    if (pageNumber <= 1) return;
    setPageNumber((oldPage) => oldPage - 1);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  if (loadingFromIpfs || savingToIpfs) {
    return <Loading fixed />;
  }

  const onSubmit = (data, event) => {
    console.log(data);
    saveToIpfs(editedToDescription(getValues()))
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="content-wrapper vault-editor">
            <div className="vault-editor__container">
              <div className="vault-editor__title">{t("VaultEditor.create-vault")}</div>

              <section className={classNames({ "desktop-only": pageNumber !== 1 })}>
                <p className="vault-editor__description">{t("VaultEditor.create-vault-description")}</p>
                {ipfsDate && (
                  <div className="vault-editor__last-saved-time">
                    {`${t("VaultEditor.last-saved-time")} `}
                    {ipfsDate.toLocaleString()}
                    {`(${t("VaultEditor.local-time")})`}
                  </div>
                )}

                <div className="vault-editor__section">
                  <p className="vault-editor__section-title">1. {t("VaultEditor.vault-details.title")}</p>
                  <div className="vault-editor__section-content">
                    <VaultDetailsForm />
                  </div>
                </div>
              </section>

              <section className={classNames({ "desktop-only": pageNumber !== 2 })}>
                <div className="vault-editor__section">
                  <p className="vault-editor__section-title">2. {t("VaultEditor.committee-details")}</p>
                  <div className="vault-editor__section-content">
                    <CommitteeDetailsForm />
                  </div>
                </div>

                <div className="vault-editor__section">
                  <p className="vault-editor__section-title">3. {t("VaultEditor.committee-members")}</p>
                  <div className="vault-editor__section-content">
                    <CommitteeMembersList />
                  </div>
                </div>
              </section>

              <section className={classNames({ "desktop-only": pageNumber !== 3 })}>
                <div className="vault-editor__section">
                  <p className="vault-editor__section-title">4. {t("VaultEditor.contracts-covered")}</p>
                  <div className="vault-editor__section-content">
                    <ContractsCoveredList />
                  </div>
                </div>
              </section>

              <section className={classNames({ "desktop-only": pageNumber !== 4 })}>
                <div className="vault-editor__section">
                  <p className="vault-editor__section-title">5. {t("VaultEditor.pgp-key")}</p>
                  <div className="vault-editor__section-content">
                    <CommunicationChannelForm />
                  </div>
                </div>
              </section>

              <div className="vault-editor__divider desktop-only"></div>

              <section className={classNames({ "desktop-only": pageNumber !== 5 })}>
                <div className="vault-editor__section">
                  <p className="vault-editor__section-title">6. {t("VaultEditor.review-vault.title")}</p>
                  <div className="vault-editor__section-content">
                    <VaultFormReview vaultDescription={editedToDescription(getValues())} />
                  </div>
                </div>
              </section>

              {/* Not uncomment */}
              {/* <CreateVault descriptionHash={ipfsHash} /> */}

              <div className="vault-editor__button-container">
                {formState.isDirty && ipfsHash && (
                  <button onClick={() => reset()} className="fill">
                    {t("VaultEditor.reset-button")}
                  </button>
                )}
                <button onClick={handleSubmit(onSubmit)} className="fill" disabled={!formState.isDirty}>
                  {t("VaultEditor.save-button")}
                </button>
              </div>

              {/* Not uncomment */}
              {/* {!changed && ipfsHash && (
          <>
            <section className={classNames({ "desktop-only": pageNumber !== 6 })}>
              <div className="vault-editor__section">
                <p className="vault-editor__section-title">7. {t("VaultEditor.review-vault.title")}</p>
                <div className="vault-editor__section-content">
                  <VaultSign message={""} onChange={null} signatures={[]} />
                </div>
              </div>
              <div className="vault-editor__button-container">
                <button onClick={sign} className="fill">
                  {t("VaultEditor.sign-submit")}
                </button>
              </div>
            </section>
          </>
        )} */}

              <div className="vault-editor__next-preview">
                {pageNumber < 5 && (
                  <div>
                    <button onClick={nextPage}>{t("VaultEditor.next")}</button>
                  </div>
                )}
                {pageNumber > 1 && (
                  <div>
                    <button onClick={previousPage}>{t("VaultEditor.previous")}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export { VaultEditorFormPage };
