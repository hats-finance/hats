import { useEffect, useState } from "react"
import { ICommitteeMember, IVaultDescription } from "types/types"
import { useTranslation } from "react-i18next";
import './index.scss'
import IconInput from "./IconEditor"
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import Members from "components/Vault/Members";

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
            <div className="vault-details">
                <div className="field">
                    <label>{t("VaultEditor.vault-details.name")}</label>
                    <input
                        name="project-metadata.name"
                        type="text"
                        value={vaultDescription?.["project-metadata"].name}
                        onChange={onVaultDescriptionChange}
                    />
                </div>
                <div className="field">
                    <label>{t("VaultEditor.vault-details.icon")}</label>
                    <IconInput
                        name="project-metadata.icon"
                        value={vaultDescription?.["project-metadata"].icon}
                        onChange={onVaultDescriptionChange}
                    />
                </div>
                <div className="project-metadata.field">
                    <label>{t("VaultEditor.vault-details.token-icon")}</label>
                    <IconInput
                        name="project-metadata.tokenIcon"
                        value={vaultDescription?.["project-metadata"]?.tokenIcon}
                        onChange={onVaultDescriptionChange}
                    />
                </div>
                <div className="field">
                    <label>{t("VaultEditor.vault-details.website")}</label>
                    <input
                        name="project-metadata.website"
                        type="text"
                        value={vaultDescription?.["project-metadata"].website}
                        onChange={onVaultDescriptionChange} />
                </div>
            </div>
            <div>
                <label>{t("VaultEditor.pgp-key")}</label>
                <EditableContent
                    name="communication-channel.pgp-pk"
                    pastable
                    onChange={onVaultDescriptionChange} />
            </div>
            <div>
                <label>{t("VaultEditor.committee-bot")}</label>
                <input
                    name="communication-channel.committee-bot"
                    type="text"
                    value={vaultDescription?.["communication-channel"]["committee-bot"]}
                    onChange={onVaultDescriptionChange} />
            </div>
            <div className="committee">
                <h2>{t("VaultEditor.committee")}</h2>
                <label>{t("VaultEditor.multisig-address")}</label>
                <EditableContent
                    name="committee.multisig-address"
                    pastable
                    textInput
                    onChange={onVaultDescriptionChange} />
                {vaultDescription?.committee?.members &&
                    <Members members={vaultDescription.committee.members} />
                }
                <div className="new-member">
                    <label>{t("VaultEditor.member-name")}</label>
                    <input name="name" type="text" value={newMemberDetails.name} onChange={onNewMemberDetailsChange} />
                    <label>{t("VaultEditor.member-address")}</label>
                    <input name="address" type="text" value={newMemberDetails.address} onChange={onNewMemberDetailsChange} />
                    <label>{t("VaultEditor.member-twitter")}</label>
                    <input name="twitter-link" type="text" value={newMemberDetails["twitter-link"]} onChange={onNewMemberDetailsChange} />
                    <label>{t("VaultEditor.member-image")}</label>
                    <IconInput name="image-ipfs-link" value={newMemberDetails["image-ipfs-link"]} onChange={onNewMemberDetailsChange} />
                    <button onClick={() => updateMembers(newMemberDetails, memberIndex)}>
                        {t("VaultEditor.add-member")}
                    </button>
                </div>
                <div
            </div>
        </div>
    </div>)
}