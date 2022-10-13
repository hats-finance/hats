import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { ipfsTransformUri } from "utils";
import { fixObject } from "hooks/useVaults";
import { ICommitteeMember, IVaultDescription } from "types/types";
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
import { IContract, IEditedVaultDescription } from "./types";
import "./index.scss";
import { uploadVaultDescription } from "./vaultService";
import { severitiesTemplate } from "./severities";

const newMember: ICommitteeMember = {
  name: "",
  address: "",
  "twitter-link": "",
  "image-ipfs-link": "",
};

const newContract: IContract = {
  name: "",
  address: "",
  severities: [],
};

const newVaultDescription: IEditedVaultDescription = {
  "project-metadata": {
    name: "",
    icon: "",
    tokenIcon: "",
    website: "",
    type: "",
  },
  "communication-channel": {
    "pgp-pk": "",
  },
  committee: {
    "multisig-address": "",
    members: [{ ...newMember }],
  },
  "contracts-covered": [{ ...newContract }],
  "severitiesTemplate": severitiesTemplate,
  source: {
    name: "",
    url: "",
  },
};

const VaultEditorFormPage = () => {
  const { t } = useTranslation();
  const [contracts, setContracts] = useState<{ contracts: IContract[] }>({ contracts: [newContract] });
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loadingFromIpfs, setLoadingFromIpfs] = useState<boolean>(false);
  const [savingToIpfs, setSavingToIpfs] = useState(false);
  const [changed, setChanged] = useState(false);
  const [ipfsDate, setIpfsDate] = useState<Date | undefined>();
  const { ipfsHash } = useParams();
  const methods = useForm<IEditedVaultDescription>({ defaultValues: newVaultDescription });
  const { handleSubmit, formState, watch } = methods;
  const severities = watch("severitiesTemplate.severities");

  async function loadFromIpfs(ipfsHash: string) {
    try {
      setLoadingFromIpfs(true);
      const response = await fetch(ipfsTransformUri(ipfsHash));
      const lastModified = response.headers.get("last-modified");
      if (lastModified) {
        setIpfsDate(new Date(lastModified));
      }
      const newVaultDescription = await response.json();
      severitiesToContracts(fixObject(newVaultDescription));

      //setVaultDescription(newVaultDescription);
      setChanged(false);
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

  // Convert contracts state variable to severities of vault description
  // useEffect(() => {
  //   setVaultDescription((prev) => {
  //     let newObject = { ...prev };
  //     setPath(
  //       newObject,
  //       "severities",
  //       severities.map((severity) => ({
  //         ...severity,
  //         "nft-metadata": {
  //           ...severity["nft-metadata"],
  //           description: vaultName + severity["nft-metadata"].description,
  //         },
  //         "contracts-covered": contracts.contracts
  //           .filter((contract) => {
  //             return contract.severities.includes(severity.name);
  //           })
  //           .map((contract) => ({ [contract.name]: contract.address })),
  //       }))
  //     );
  //     return newObject;
  //   });
  // }, [contracts, vaultName]);

  function severitiesToContracts(vaultDescription: IVaultDescription) {
    let contracts = [] as IContract[];
    vaultDescription.severities.forEach((severity) => {
      const contractsCovered = severity["contracts-covered"]?.length === 0 ? [newContract] : severity["contracts-covered"];
      contractsCovered.forEach((item) => {
        const name = Object.keys(item)[0];
        const address = Object.values(item)[0] as string;
        let contract = contracts.find((item) => item.name === name && item.address === address);
        if (contract) {
          let contractIndex = contracts.indexOf(contract);
          contracts[contractIndex] = {
            name,
            address,
            severities: [...contract.severities, severity.name],
          };
        } else {
          contracts.push({
            name,
            address,
            severities: [severity.name],
          });
        }
      });
    });
    setContracts({ contracts });
  }

  async function saveToIpfs(vaultDescription) {
    console.log("vaultDescription", vaultDescription);

    return;
    try {
      setSavingToIpfs(true);
      await uploadVaultDescription(vaultDescription);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingToIpfs(false);
    }
  }

  // // Pagination in mobile
  // function nextPage() {
  //   if (pageNumber >= 5) return;
  //   setPageNumber(pageNumber + 1);
  //   window.scroll({
  //     top: 0,
  //     left: 0,
  //     behavior: "smooth",
  //   });
  // }

  // function previousPage() {
  //   if (pageNumber <= 1) return;
  //   setPageNumber((oldPage) => oldPage - 1);
  //   window.scroll({
  //     top: 0,
  //     left: 0,
  //     behavior: "smooth",
  //   });
  // }

  if (loadingFromIpfs || savingToIpfs) {
    return <Loading fixed />;
  }

  const onSubmit = (data, event) => {
    saveToIpfs(data)

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
                    <ContractsCoveredList
                      contracts={contracts.contracts}
                      severitiesOptions={severities.map((severity) => ({
                        label: severity.name,
                        value: severity.name,
                      }))}
                    />
                  </div>
                </div>
              </section>

              {/* <section className={classNames({ "desktop-only": pageNumber !== 4 })}>
            <div className="vault-editor__section">
              <p className="vault-editor__section-title">5. {t("VaultEditor.pgp-key")}</p>
              <div className="vault-editor__section-content">
                <CommunicationChannelForm

                />
              </div>
            </div>
          </section> */}

              <div className="vault-editor__divider desktop-only"></div>

              {/* <section className={classNames({ "desktop-only": pageNumber !== 5 })}>
            <div className="vault-editor__section">
              <p className="vault-editor__section-title">6. {t("VaultEditor.review-vault.title")}</p>
              <div className="vault-editor__section-content">
                <VaultFormReview vaultDescription={vaultDescription} />
              </div>
            </div>
          </section> */}

              {/* Not uncomment */}
              {/* <CreateVault descriptionHash={ipfsHash} /> */}

              <div className="vault-editor__button-container">
                {changed && ipfsHash && (
                  <button onClick={() => loadFromIpfs(ipfsHash)} className="fill">
                    {t("VaultEditor.reset-button")}
                  </button>
                )}
                <button onClick={saveToIpfs} className="fill" disabled={!formState.isDirty}>
                  {t("VaultEditor.save-button")}
                </button>
                <input type="submit" />
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

              {/* <div className="vault-editor__next-preview">
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
          </div> */}
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export { VaultEditorFormPage };
