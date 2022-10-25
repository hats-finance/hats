import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { RoutePaths } from "navigation";
import classNames from "classnames";
import { ipfsTransformUri } from "utils";
import { fixObject } from "hooks/useVaults";
import { FormSelectInput, Loading } from "components";
import { IVaultDescription } from "types/types";
import {
  ContractsCoveredList,
  VaultDetailsForm,
  CommitteeDetailsForm,
  CommitteeMembersList,
  VaultFormReview,
  CommunicationChannelForm,
} from ".";
import { IEditedVaultDescription } from "./types";
import { uploadVaultDescriptionToIpfs } from "./vaultService";
import { descriptionToEditedForm, editedFormToDescription, createNewVaultDescription } from "./utils";
import { VulnerabilitySeveritiesList } from "./VulnerabilitySeveritiesList/VulnerabilitySeveritiesList";
import { Section, VaultEditorForm } from "./styles";
import { getPath } from "utils/objects.utils";

const VaultEditorFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loadingFromIpfs, setLoadingFromIpfs] = useState<boolean>(false);
  const [savingToIpfs, setSavingToIpfs] = useState(false);
  const [ipfsDate, setIpfsDate] = useState<Date | undefined>();
  const { ipfsHash } = useParams();

  const methods = useForm<IEditedVaultDescription>({ defaultValues: createNewVaultDescription('v2') });
  const { handleSubmit, formState, reset: handleReset, control } = methods;

  async function loadFromIpfs(ipfsHash: string) {
    try {
      setLoadingFromIpfs(true);
      const response = await fetch(ipfsTransformUri(ipfsHash));
      const lastModified = response.headers.get("last-modified");
      if (lastModified) {
        setIpfsDate(new Date(lastModified));
      }
      const newVaultDescription = await response.json();
      handleReset(descriptionToEditedForm(fixObject(newVaultDescription)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFromIpfs(false);
    }
  }

  useEffect(() => {
    if (ipfsHash) {
      loadFromIpfs(ipfsHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipfsHash]);

  async function saveToIpfs(vaultDescription: IVaultDescription) {
    try {
      setSavingToIpfs(true);
      const ipfsHash = await uploadVaultDescriptionToIpfs(vaultDescription);
      navigate(`${RoutePaths.vault_editor}/${ipfsHash}`);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingToIpfs(false);
    }
  }

  // Pagination in mobile
  function nextPage() {
    if (pageNumber >= 6) return;
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

  const onSubmit = (data: IEditedVaultDescription) => {
    saveToIpfs(editedFormToDescription(data));
  };

  return (
    <FormProvider {...methods}>
      <VaultEditorForm className="content-wrapper vault-editor" onSubmit={handleSubmit(onSubmit)}>
        <div className="editor-title">{t("VaultEditor.create-vault")}</div>

        <Controller
          control={control}
          name={`version`}
          render={({ field, formState }) => (
            <FormSelectInput
              isDirty={getPath(formState.dirtyFields, field.name)}
              label={t("version")}
              placeholder={t("version")}
              colorable
              options={['v1', 'v2'].map(version =>
                ({ label: version, value: version }))}
              {...field}
            />
          )}
        />
        <section className={classNames({ onlyDesktop: pageNumber !== 1 })}>
          <p className="editor-description">{t("VaultEditor.create-vault-description")}</p>
          {ipfsDate && (
            <div className="last-saved-time">
              {`${t("VaultEditor.last-saved-time")} `}
              {ipfsDate.toLocaleString()}
              {`(${t("VaultEditor.local-time")})`}
            </div>
          )}

          <Section>
            <p className="section-title">1. {t("VaultEditor.vault-details.title")}</p>
            <div className="section-content">
              <VaultDetailsForm />
            </div>
          </Section>
        </section>

        <section className={classNames({ onlyDesktop: pageNumber !== 2 })}>
          <Section>
            <p className="section-title">2. {t("VaultEditor.committee-details")}</p>
            <div className="section-content">
              <CommitteeDetailsForm />
            </div>
          </Section>

          <Section>
            <p className="section-title">3. {t("VaultEditor.committee-members")}</p>
            <div className="section-content">
              <CommitteeMembersList />
            </div>
          </Section>
        </section>

        <section className={classNames({ onlyDesktop: pageNumber !== 3 })}>
          <Section>
            <p className="section-title">4. {t("VaultEditor.contracts-covered")}</p>
            <div className="section-content">
              <ContractsCoveredList />
            </div>
          </Section>
        </section>

        <section className={classNames({ onlyDesktop: pageNumber !== 4 })}>
          <Section>
            <p className="section-title">5. {t("VaultEditor.pgp-key")}</p>
            <div className="section-content">
              <CommunicationChannelForm />
            </div>
          </Section>
        </section>

        <section className={classNames({ onlyDesktop: pageNumber !== 5 })}>
          <Section>
            <p className="section-title">6. {t("VaultEditor.vulnerabilities")}</p>
            <div className="section-content">
              <VulnerabilitySeveritiesList />
            </div>
          </Section>
        </section>

        <section className={classNames({ onlyDesktop: pageNumber !== 6 })}>
          <Section>
            <p className="section-title">7. {t("VaultEditor.review-vault.title")}</p>
            <div className="section-content">
              <VaultFormReview />
            </div>
          </Section>
        </section>

        {/* Not uncomment */}
        {/* <CreateVault descriptionHash={ipfsHash} /> */}

        <div className="buttons-container">
          {formState.isDirty && ipfsHash && (
            <button type="button" onClick={() => handleReset()} className="fill">
              {t("VaultEditor.reset-button")}
            </button>
          )}
          <button type="button" onClick={handleSubmit(onSubmit)} className="fill" disabled={!formState.isDirty}>
            {t("VaultEditor.save-button")}
          </button>
        </div>

        {/* Not uncomment */}
        {/* {!changed && ipfsHash && (
                <>
                  <section className={classNames({ "onlyDesktop": pageNumber !== 6 })}>
                    <div className="vault-editor__section">
                      <p className="vault-editor__section-title">7. {t("VaultEditor.review-vault.title")}</p>
                      <div className="vault-editor__section-content">
                        <VaultSign message={""} onChange={null} signatures={[]} />
                      </div>
                    </div>
                    <div className="vault-editor__button-container">
                      <button type="button" onClick={sign} className="fill">
                        {t("VaultEditor.sign-submit")}
                      </button>
                    </div>
                  </section>
                </>
              )} */}

        <div className="mobile-buttons-container onlyMobile">
          {pageNumber > 1 && (
            <button type="button" onClick={previousPage}>
              {t("VaultEditor.previous")}
            </button>
          )}
          {pageNumber < 6 && (
            <button type="button" onClick={nextPage}>
              {t("VaultEditor.next")}
            </button>
          )}
        </div>
      </VaultEditorForm>
    </FormProvider>
  );
};

export { VaultEditorFormPage };
