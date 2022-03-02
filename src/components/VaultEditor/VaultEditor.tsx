import { useEffect, useState } from "react"
import { ICommitteeMember, IVault, IVaultDescription } from "types/types"
import { useTranslation } from "react-i18next";
import './index.scss'
import IconInput from "./IconEditor"
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import RemoveIcon from "assets/icons/remove-member.svg";
import Tooltip from "rc-tooltip";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../../constants/constants";
import InfoIcon from "assets/icons/info.icon";
import DownArrowIcon from "assets/icons/down-arrow.icon.svg";
import UpArrowIcon from "assets/icons/up-arrow.icon.svg";
import MultiSelect from "components/Shared/MultiSelect/MultiSelect";
import classNames from "classnames";
import PreviewVault from "./PreviewVault";


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
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [showMobileHint, setShowMobileHint] = useState<boolean>(false);

    // Will replace with real severities options
    const severitiesOptions = [
        { label: 'Thing 1', value: 1 },
        { label: 'Thing 2', value: 2 },
        { label: 'Thing 3', value: 3 },
    ];

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

    function getVault(description: IVaultDescription): IVault {
        return {
            id: "",
            name: "",
            description: description,
            descriptionHash: "",
            bounty: "",
            isGuest: false,
            parentVault: {
                id: "",
                pid: "",
                stakingToken: "",
                stakingTokenDecimals: "18",
                stakingTokenSymbol: "",
                totalStaking: "",
                honeyPotBalance: "",
                totalReward: "0",
                totalRewardPaid: "0",
                committee: [""],
                allocPoint: "0",
                master: {
                    address: "",
                    numberOfSubmittedClaims: "",
                    withdrawPeriod: "",
                    safetyPeriod: "",
                    withdrawRequestEnablePeriod: "",
                    withdrawRequestPendingPeriod: "",
                    vestingHatDuration: "",
                    vestingHatPeriods: "",
                    id: "",
                    governance: "",
                    totalStaking: "",
                    totalReward: "",
                    totalRewardPaid: "",
                    rewardPerBlock: "",
                    startBlock: "",
                    parentVaults: [],
                    totalAllocPoints: "",
                    createdAt: "",
                    rewardsToken: "",
                    submittedClaim: [],
                },
                numberOfApprovedClaims: "0",
                rewardsLevels: ["100", "125", "156", "195", "243", "303", "378", "500", "590", "737", "921", "1151", "1438", "1797", "2000", "2500", "3125", "4000", "5000", "6000", "8000"],
                totalRewardAmount: "0",
                liquidityPool: false,
                registered: true,
                withdrawRequests: [],
                totalUsersShares: "",
                descriptionHash: "",
                hackerVestedRewardSplit: "6000",
                hackerRewardSplit: "2000",
                committeeRewardSplit: "500",
                swapAndBurnSplit: "0",
                governanceHatRewardSplit: "1000",
                hackerHatRewardSplit: "500",
                vestingDuration: "3600",
                vestingPeriods: "3600",
                depositPause: false,
                committeeCheckedIn: true,
                approvedClaims: [],
                stakers: [],
                guests: [],
                apy: 0,
                tokenPrice: 0,
            },
        }
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
                                                <div className="committee-members__member-icons">
                                                    <div>
                                                        <label>{t("VaultEditor.member-image")}</label>
                                                        <IconInput name="image-ipfs-link" value={member["image-ipfs-link"]} onChange={console.log} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="fill">
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
                            <button className="fill" onClick={() => updateMembers(newMemberDetails, memberIndex)}>
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
                            {(vaultDescription?.committee?.members || []).map((member, index) => {
                                return (
                                    <>
                                        <div className="contracts-covered__contract">
                                            <div className="contracts-covered__contract-number">
                                                {index + 1}
                                            </div>
                                            <div className="contracts-covered__contract-content">
                                                <div className="contracts-covered__contract-subcontent">
                                                    <div className="contracts-covered__contract-name">
                                                        <label>{t("VaultEditor.contract-name")}</label>
                                                        <EditableContent
                                                            textInput
                                                            name="name"
                                                            value={member.name}
                                                            placeholder={t("VaultEditor.contract-name-placeholder")}
                                                        />
                                                    </div>
                                                    <div className="contracts-covered__contract-severities">
                                                        <label>{t("VaultEditor.contract-severities")}</label>
                                                        <MultiSelect options={severitiesOptions} />
                                                    </div>
                                                </div>
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
                                        <button className="fill">
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
                                    <div className="contracts-covered__contract-subcontent">
                                        <div className="contracts-covered__contract-name">
                                            <label>{t("VaultEditor.contract-name")}</label>
                                            <EditableContent
                                                textInput
                                                name="name"
                                                value={newMemberDetails.name}
                                                onChange={onNewMemberDetailsChange}
                                                placeholder={t("VaultEditor.contract-name-placeholder")}
                                            />
                                        </div>
                                        <div className="contracts-covered__contract-severities">
                                            <label>{t("VaultEditor.contract-severities")}</label>
                                            <MultiSelect options={severitiesOptions} />
                                        </div>
                                    </div>
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
                            <button className="fill" onClick={() => updateMembers(newMemberDetails, memberIndex)}>
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
                        <div className="pgp-key">
                            <div className="pgp-key__hint">
                                {t("VaultEditor.pgp-key-hint-1")}
                                <Tooltip
                                    placement="top"
                                    overlayClassName="tooltip"
                                    overlayInnerStyle={{ ...RC_TOOLTIP_OVERLAY_INNER_STYLE, maxWidth: 500 }}
                                    overlay={t("VaultEditor.pgp-key-hint-tooltip")}
                                >
                                    <span className="pgp-key__hint-desk-tooltip"><InfoIcon width="15" height="15" fill={Colors.white} /></span>
                                </Tooltip>
                                {t("VaultEditor.pgp-key-hint-2")}

                                <div className="mobile-only">
                                    <div
                                        className="pgp-key__hint-question"
                                        onClick={() => setShowMobileHint(old => !old)}
                                    >
                                        {t("VaultEditor.pgp-key-hint-question")}
                                        {showMobileHint && (
                                            <img src={DownArrowIcon} alt="down arrow" width={12} height={12} />
                                        )}
                                        {!showMobileHint && (
                                            <img src={UpArrowIcon} alt="up arrow" width={12} height={12} />
                                        )}
                                    </div>

                                    <div className={classNames("pgp-key__hint-tooltip", {
                                        "pgp-key__hint-tooltip--show": showMobileHint
                                    })}>
                                        {t("VaultEditor.pgp-key-hint-tooltip")}
                                    </div>
                                </div>
                            </div>
                            <p className="vault-editor__section-description">
                                {t("VaultEditor.pgp-key-description")}
                                <br></br>
                                <br></br>
                            </p>
                            <button className="fill">
                                {t("VaultEditor.go-to-tool")}
                            </button>
                            <div>
                                <label>{t("VaultEditor.pgp-key")}</label>
                                <EditableContent
                                    name="communication-channel.pgp-pk"
                                    pastable
                                    onChange={onVaultDescriptionChange}
                                    placeholder={t("VaultEditor.pgp-key-placeholder")} />
                            </div>
                            <div>
                                <label>{t("VaultEditor.committee-bot")}</label>
                                <EditableContent
                                    textInput
                                    name="communication-channel.committee-bot"
                                    value={vaultDescription?.["communication-channel"]["committee-bot"]}
                                    onChange={onVaultDescriptionChange} />
                            </div>
                        </div>
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
                        <p className="vault-editor__section-description">
                            {t("VaultEditor.review-vault.description-1")}
                            <br></br>
                            {t("VaultEditor.review-vault.description-2")}
                        </p>
                        <p className="vault-editor__section-description">
                            {t("VaultEditor.review-vault.description-3")}
                        </p>
                        <label>{t("VaultEditor.preview-vault")}</label>
                        <PreviewVault data={getVault(vaultDescription)} />
                        <label>{t("VaultEditor.sign-message")}</label>
                        <EditableContent
                            removable
                            name="sign_message"
                        />
                        <label>{t("VaultEditor.signees")}</label>
                        <div className="signees">
                            <div className="signees__signee">
                                <div className="signees__signee-number">
                                    1
                                </div>
                                <div className="signees__signee-content">
                                    2345fhgf345678909087654kjghfdssdfg
                                </div>
                            </div>
                            <div className="signees__signee">
                                <div className="signees__signee-number">
                                    2
                                </div>
                                <div className="signees__signee-content">
                                    2345fhgf345678909087654kjghfdssdfg
                                </div>
                            </div>
                        </div>
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