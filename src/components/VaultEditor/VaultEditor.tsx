import { useEffect, useState } from "react"
import { ICommitteeMember, IVaultDescription } from "types/types"
import { useTranslation } from "react-i18next";
import './index.scss'
import IconInput from "./IconEditor"
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import RemoveIcon from "assets/icons/remove-member.svg";

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
        members: []
    },
    severities: [],
    source: {
        name: "",
        url: ""
    }
}

const newMember: ICommitteeMember = {
    name: "",
    address: "",
    "twitter-link": "",
    "image-ipfs-link": ""
}

export default function VaultEditor() {
    const { t } = useTranslation();
    const [hasChanged, setHasChanged] = useState(false)
    const [editingDetails, setEditingDetails] = useState(false)
    const [vaultDescription, setVaultDescription] = useState<IVaultDescription>(newVaultDescription)
    const [newMemberDetails, setNewMemberDetails] = useState<ICommitteeMember>(newMember)
    const [memberIndex, setMemberIndex] = useState<number | undefined>(undefined)

    useEffect(() => {
        console.log(vaultDescription)
    }, [vaultDescription])

    useEffect(() => {
        console.log(newMemberDetails)
    }, [newMemberDetails])

    function setToValue(obj, value, path) {
        var i;
        path = path.split('.');
        for (i = 0; i < path.length - 1; i++)
            obj = obj[path[i]];

        obj[path[i]] = value;
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setState: (value: any) => void) {

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

        setState(prev => {
            let newObject = { ...prev }
            setToValue(newObject, value, e.target.name)
            return newObject
        })
    }

    function onVaultDescriptionChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        onChange(e, setVaultDescription)
    }

    function onNewMemberDetailsChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        onChange(e, setNewMemberDetails)
    }

    function updateMembers(member: ICommitteeMember, index: number | undefined) {
        if (index === undefined) {
            setVaultDescription(prev => {
                let newVaultDescription = { ...prev }
                newVaultDescription.committee.members.push(member)
                return newVaultDescription
            })
        } else {
            setVaultDescription(prev => {
                let newVaultDescription = { ...prev }
                newVaultDescription.committee.members[index] = member
                return newVaultDescription
            })
        }
        setMemberIndex(undefined)
        setNewMemberDetails(newMember)
    }

    return (<div>
        <div className="content vault-editor">
            <div className="vault-editor__title">
                {t("VaultEditor.create-vault")}
            </div>
            <p className="vault-editor__description">
                {t("VaultEditor.create-vault-description-1")}
                <br></br>
                {t("VaultEditor.create-vault-description-2")}
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
                    <div className="vault-details">
                        <div className="field">
                            <label>{t("VaultEditor.vault-details.name")}</label>
                            <EditableContent
                                textInput
                                name="project-metadata.name"
                                value={vaultDescription?.["project-metadata"].name}
                                onChange={onVaultDescriptionChange}
                                placeholder={t("VaultEditor.vault-details.name-placeholder")} />
                            <label>{t("VaultEditor.vault-details.website")}</label>
                            <EditableContent
                                name="project-metadata.website"
                                textInput
                                value={vaultDescription?.["project-metadata"].website}
                                onChange={onVaultDescriptionChange}
                                placeholder={t("VaultEditor.vault-details.website-placeholder")} />
                        </div>
                        <div className="field icon-inputs">
                            <div>
                                <label>{t("VaultEditor.vault-details.icon")}</label>
                                <IconInput
                                    name="project-metadata.icon"
                                    value={vaultDescription?.["project-metadata"]?.icon}
                                    onChange={onVaultDescriptionChange}
                                />
                            </div>
                            <div>
                                <label>{t("VaultEditor.vault-details.token-icon")}</label>
                                <IconInput
                                    name="project-metadata.tokenIcon"
                                    value={vaultDescription?.["project-metadata"]?.tokenIcon}
                                    onChange={onVaultDescriptionChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div>
                <label>{t("VaultEditor.pgp-key")}</label>
                <EditableContent
                    name="communication-channel.pgp-pk"
                    pastable
                    onChange={onVaultDescriptionChange} />
            </div>
            <div>
                <label>{t("VaultEditor.committee-bot")}</label>
                <EditableContent
                    textInput
                    name="communication-channel.committee-bot"
                    value={vaultDescription?.["communication-channel"]["committee-bot"]}
                    onChange={onVaultDescriptionChange} />
            </div> */}

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
                        onChange={onVaultDescriptionChange}
                        placeholder={t("VaultEditor.vault-details.multisig-address-placeholder")} />
                </div>
            </div>

            <div className="vault-editor__section">
                <p className="vault-editor__section-title">
                    3. {t("VaultEditor.committee-members")}
                </p>
                <div className="vault-editor__section-content">
                    <div className="committee-members">
                        {(vaultDescription?.committee?.members || []).map((member, index) => {
                            return (
                                <>
                                    <div className="committee-members__member">
                                        <div className="committee-members__member-number">
                                            {index + 1}
                                        </div>
                                        <div className="committee-members__member-content">
                                            <div className="committee-members__member-inputs">
                                                <label>{t("VaultEditor.member-name")}</label>
                                                <EditableContent
                                                    textInput
                                                    name="name"
                                                    value={member.name}
                                                    placeholder={t("VaultEditor.member-name-placeholder")}
                                                />
                                                <label>{t("VaultEditor.member-twitter")}</label>
                                                <EditableContent
                                                    textInput
                                                    pastable
                                                    name="twitter-link"
                                                    value={member["twitter-link"]}
                                                    placeholder={t("VaultEditor.member-twitter-placeholder")}
                                                />
                                                <label>{t("VaultEditor.member-address")}</label>
                                                <EditableContent
                                                    textInput
                                                    pastable
                                                    name="address"
                                                    value={member.address}
                                                    placeholder={t("VaultEditor.member-address-placeholder")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button>
                                        <img src={RemoveIcon} height={12} alt="remove-member" />
                                        {` ${t("VaultEditor.remove-member")}`}
                                    </button>
                                </>
                            );
                        })}

                        <div className="committee-members__member">
                            <div className="committee-members__member-number">
                                {(vaultDescription?.committee?.members || []).length + 1}
                            </div>
                            <div className="committee-members__member-content">
                                <div className="committee-members__member-inputs">
                                    <label>{t("VaultEditor.member-name")}</label>
                                    <EditableContent
                                        textInput
                                        name="name"
                                        value={newMemberDetails.name}
                                        onChange={onNewMemberDetailsChange}
                                        placeholder={t("VaultEditor.member-name-placeholder")}
                                    />
                                    <label>{t("VaultEditor.member-twitter")}</label>
                                    <EditableContent
                                        textInput
                                        pastable
                                        name="twitter-link"
                                        value={newMemberDetails["twitter-link"]}
                                        onChange={onNewMemberDetailsChange}
                                        placeholder={t("VaultEditor.member-twitter-placeholder")}
                                    />
                                    <label>{t("VaultEditor.member-address")}</label>
                                    <EditableContent
                                        textInput
                                        pastable
                                        name="address"
                                        value={newMemberDetails.address}
                                        onChange={onNewMemberDetailsChange}
                                        placeholder={t("VaultEditor.member-address-placeholder")}
                                    />
                                </div>
                                <div className="committee-members__member-icons">
                                    <div>
                                        <label>{t("VaultEditor.member-image")}</label>
                                        <IconInput name="image-ipfs-link" value={newMemberDetails["image-ipfs-link"]} onChange={onNewMemberDetailsChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => updateMembers(newMemberDetails, memberIndex)}>
                            {t("VaultEditor.add-member")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="vault-editor__section">
                <p className="vault-editor__section-title">
                    4. {t("VaultEditor.contracts-covered")}
                </p>
                <div className="vault-editor__section-content">
                    <div className="contracts-covered">
                        {(vaultDescription?.committee?.members || []).map((member, index) => {
                            return (
                                <>
                                    <div className="contracts-covered__contract">
                                        <div className="contracts-covered__contract-number">
                                            {index + 1}
                                        </div>
                                        <div className="contracts-covered__contract-content">
                                            <div className="contracts-covered__contract-inputs">
                                                <label>{t("VaultEditor.contract-name")}</label>
                                                <EditableContent
                                                    textInput
                                                    name="name"
                                                    value={member.name}
                                                    placeholder={t("VaultEditor.contract-name-placeholder")}
                                                />
                                                <label>{t("VaultEditor.contract-address")}</label>
                                                <EditableContent
                                                    textInput
                                                    pastable
                                                    name="address"
                                                    value={member.address}
                                                    placeholder={t("VaultEditor.contract-address-placeholder")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button>
                                        <img src={RemoveIcon} height={12} alt="remove-member" />
                                        {` ${t("VaultEditor.remove-member")}`}
                                    </button>
                                </>
                            );
                        })}

                        <div className="contracts-covered__contract">
                            <div className="contracts-covered__contract-number">
                                {(vaultDescription?.committee?.members || []).length + 1}
                            </div>
                            <div className="contracts-covered__contract-content">
                                <label>{t("VaultEditor.contract-name")}</label>
                                <EditableContent
                                    textInput
                                    name="name"
                                    value={newMemberDetails.name}
                                    onChange={onNewMemberDetailsChange}
                                    placeholder={t("VaultEditor.contract-name-placeholder")}
                                />
                                <label>{t("VaultEditor.contract-address")}</label>
                                <EditableContent
                                    textInput
                                    pastable
                                    name="address"
                                    value={newMemberDetails.address}
                                    onChange={onNewMemberDetailsChange}
                                    placeholder={t("VaultEditor.contract-address-placeholder")}
                                />
                            </div>
                        </div>
                        <button onClick={() => updateMembers(newMemberDetails, memberIndex)}>
                            {t("VaultEditor.add-member")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="vault-editor__button-container">
                <button>{t("VaultEditor.save-button")}</button>
            </div>

            <div className="vault-editor__divider"></div>

            <div className="vault-editor__section">
                <p className="vault-editor__section-title">
                    5. {t("VaultEditor.review-vault.title")}
                </p>
                <div className="vault-editor__section-content">
                    <p className="vault-editor__section-description">
                        {t("VaultEditor.review-vault.description-1")}
                        <br></br>
                        {t("VaultEditor.review-vault.description-2")}
                    </p>
                    <p className="vault-editor__section-description">
                        {t("VaultEditor.review-vault.description-3")}
                    </p>
                </div>
            </div>

            <div className="vault-editor__button-container">
                <button>{t("VaultEditor.sign-submit")}</button>
            </div>
        </div>
    </div>)
}