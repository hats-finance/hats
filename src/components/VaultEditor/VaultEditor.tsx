import { useState } from "react"
import { ICommitteeMember, IVaultDescription } from "types/types"
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import CommmitteeMember from "./CommitteeMember";
import ContractCovered from "./ContractCovered";
import VaultDetails from "./VaultDetails";
import PgpKey from "./PgpKey";
import VaultReview from "./VaultReview";
import VaultSign from "./VaultSign";
import './index.scss'

const newMember: ICommitteeMember = {
    name: "",
    address: "",
    "twitter-link": "",
    "image-ipfs-link": ""
}

const newVaultDescription: IVaultDescription = {
    "project-metadata": {
        name: "",
        icon: "",
        tokenIcon: "",
        website: "",
    },
    "communication-channel": {
        "committee-bot": "",
        "pgp-pk": "",
    },
    committee: {
        "multisig-address": "",
        members: [{...newMember}]
    },
    severities: [],
    source: {
        name: "",
        url: ""
    }
}

export default function VaultEditor() {
    const { t } = useTranslation();
    const [vaultDescription, setVaultDescription] = useState<IVaultDescription>(newVaultDescription)
    const [pageNumber, setPageNumber] = useState<number>(1)

    // eslint-disable-next-line no-useless-escape
    const splitChars = /[\.\[\]\'\"]/
    const setPath = (object, path, value) => path
        .split(splitChars)
        .reduce((o, p, i) => o[p] = path.split(splitChars).length === ++i ? value : o[p] || {}, object)

    const getPath = (object, path) => path
        .split(splitChars)
        .reduce((o, p) => o && o[p], object)

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let value
        if (e.target instanceof HTMLInputElement) {
            if (e.target.files && e.target.files.length > 0) {
                value = URL.createObjectURL(e.target.files[0])
            } else {
                value = e.target.value
            }
        } else if (e.target instanceof HTMLTextAreaElement) {
            value = e.target.value
        }

        setVaultDescription(prev => {
            let newObject = { ...prev }
            setPath(newObject, e.target.name, value)
            console.log(newObject)
            return newObject
        })
    }

    function removeFromArray(path: string, index: number, newItem: object) {
        let newArray = getPath(vaultDescription, path)
        newArray.splice(index, 1)
        if (newArray.length < 1) newArray = [{...(newItem || {})}]
        let newObject = { ...vaultDescription }
        setPath(newObject, path, newArray)
        setVaultDescription(newObject);
    }

    function addMember() {
        setVaultDescription(prev => {
            let newObject = { ...prev }
            setPath(newObject, "committee.members", [...prev.committee.members, {...newMember}])
            return newObject
        })
    }

    function removeMember(index: number) {
        removeFromArray("committee.members", index, newMember)
    }

    // Pagination in mobile
    function nextPage() {
        if (pageNumber >= 5) return
        setPageNumber(pageNumber + 1)
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    function previousPage() {
        if (pageNumber <= 1) return
        setPageNumber(oldPage => oldPage - 1)
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    return (
        <div className="content vault-editor">
            <div className="vault-editor__title">
                {t("VaultEditor.create-vault")}
            </div>

            <section className={classNames({ 'desktop-only': pageNumber !== 1 })}>
                <p className="vault-editor__description">
                    {t("VaultEditor.create-vault-description")}
                </p>
                <div className="vault-editor__last-saved-time">
                    {`${t("VaultEditor.last-saved-time")} `}
                    2/14/2022 00:00
                    {`(${t("VaultEditor.local-time")})`}
                </div>

                <div className="vault-editor__section">
                    <p className="vault-editor__section-title">
                        1. {t("VaultEditor.vault-details.title")}
                    </p>
                    <div className="vault-editor__section-content">
                        <VaultDetails
                            projectMetaData={vaultDescription?.["project-metadata"]}
                            onChange={onChange}
                        />
                    </div>
                </div>
            </section>

            <section className={classNames({ 'desktop-only': pageNumber !== 2 })}>
                <div className="vault-editor__section">
                    <p className="vault-editor__section-title">
                        2. {t("VaultEditor.committee-details")}
                    </p>
                    <div className="vault-editor__section-content">
                        <label>{t("VaultEditor.multisig-address")}</label>
                        <EditableContent
                            name="committee.multisig-address"
                            pastable
                            textInput
                            onChange={onChange}
                            placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")} />
                    </div>
                </div>

                <div className="vault-editor__section">
                    <p className="vault-editor__section-title">
                        3. {t("VaultEditor.committee-members")}
                    </p>
                    <div className="vault-editor__section-content">
                        <div className="committee-members">
                            {(vaultDescription?.committee?.members || []).map((member, index) =>
                                <CommmitteeMember
                                    key={index}
                                    member={member}
                                    index={index}
                                    onChange={onChange}
                                    onRemove={removeMember}
                                />)}

                            <button className="fill" onClick={addMember}>
                                {t("VaultEditor.add-member")}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className={classNames({ 'desktop-only': pageNumber !== 3 })}>
                <div className="vault-editor__section">
                    <p className="vault-editor__section-title">
                        4. {t("VaultEditor.contracts-covered")}
                    </p>
                    <div className="vault-editor__section-content">
                        <div className="contracts-covered">
                            {(vaultDescription?.committee?.members || []).map((member, index) =>
                                <ContractCovered
                                    key={index}
                                    member={member}
                                    index={index}
                                    onChange={onChange}
                                    onRemove={removeMember}
                                />)}

                            <button className="fill" onClick={addMember}>
                                {t("VaultEditor.add-member")}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className={classNames({ 'desktop-only': pageNumber !== 4 })}>
                <div className="vault-editor__section">
                    <p className="vault-editor__section-title">
                        5. {t("VaultEditor.pgp-key")}
                    </p>
                    <div className="vault-editor__section-content">
                        <PgpKey
                            communicationChannel={vaultDescription?.["communication-channel"]}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <div className="vault-editor__button-container">
                    <button className="fill">{t("VaultEditor.save-button")}</button>
                </div>
            </section>

            <div className="vault-editor__divider desktop-only"></div>

            <section className={classNames({ 'desktop-only': pageNumber !== 5 })}>
                <div className="vault-editor__section">
                    <p className="vault-editor__section-title">
                        6. {t("VaultEditor.review-vault.title")}
                    </p>
                    <div className="vault-editor__section-content">
                        <VaultReview vaultDescription={vaultDescription} />
                        <VaultSign />
                    </div>
                </div>

                <div className="vault-editor__button-container">
                    <button className="fill">{t("VaultEditor.sign-submit")}</button>
                </div>
            </section>

            <div className="vault-editor__next-preview">
                {pageNumber < 5 && (
                    <div>
                        <button className="fill" onClick={nextPage}>{t("VaultEditor.next")}</button>
                    </div>
                )}
                {pageNumber > 1 && (
                    <div>
                        <button onClick={previousPage}>{t("VaultEditor.previous")}</button>
                    </div>
                )}
            </div>
        </div>
    )
}