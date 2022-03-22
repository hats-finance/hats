import { useEffect, useState } from "react"
import { ICommitteeMember, ISeverity, IVaultDescription } from "types/types"
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
import { uploadVaultDescription } from "./uploadVaultDescription";
import { getPath, setPath } from "./objectUtils";
import { useLocation } from "react-router-dom";

const newMember: ICommitteeMember = {
    name: "",
    address: "",
    "twitter-link": "",
    "image-ipfs-link": ""
}

function createSeverity(severity: string): ISeverity {
    return {
        name: severity,
        "contracts-covered": [{ "NEW_CONTRACT": "0x0" }],
        index: 1,
        "nft-metadata": {
            "name": "",
            "description": "",
            "animation_url": "",
            "image": "",
            "external_url": ""
        },
        "reward-for": "",
        "description": ""
    }
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
        members: [{ ...newMember }]
    },
    severities: ["Low", "Medium", "High", "Critical"].map(createSeverity),
    source: {
        name: "",
        url: ""
    }
}




export default function VaultEditor() {
    const { t } = useTranslation();
    const [vaultDescription, setVaultDescription] = useState<IVaultDescription>(newVaultDescription)
    const [pageNumber, setPageNumber] = useState<number>(1)

    const location = useLocation();

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if (params.ipfs) {
            (async () => {
                const response = await fetch(params.ipfs)
                setVaultDescription(await response.json())
            })();
        }
    }, [location.search]);


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
            return newObject
        })
    }

    function removeFromArray(object, path: string, index: number, newItem?: object) {
        let newArray = getPath(object, path)
        newArray.splice(index, 1)
        if (newArray.length < 1 && newItem) newArray = [{ ...(newItem || {}) }]
        let newObject = { ...object }
        setPath(newObject, path, newArray)
        return newObject
    }

    function addMember() {
        setVaultDescription(prev => {
            let newObject = { ...prev }
            setPath(newObject, "committee.members", [...prev.committee.members, { ...newMember }])
            return newObject
        })
    }

    function removeMember(index: number) {
        let newVaultDescription = removeFromArray(vaultDescription, "committee.members", index, newMember)
        setVaultDescription(newVaultDescription);
    }

    function addContract() {
        // setVaultDescription(prev => {
        //     let newObject = { ...prev }
        //     setPath(newObject, "severities", [...prev.severities, { ...create }])

        //     return newObject
        // })
    }

    function removeContract(index: number) {
        // let newContracts = removeFromArray(contracts, "contracts", index, newContract)
        // setContracts(newContracts);
    }

    // function onContractChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     setContracts(prev => {
    //         let newObject = { ...prev }
    //         setPath(newObject, e.target.name, e.target.value)
    //         console.log(newObject)
    //         return newObject
    //     })
    // }

    function onChangeContract(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, activeSeverities: ISeverity[], index: number) {
        console.log({ e, activeSeverities, index })
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

        activeSeverities.forEach((severity, severityIndex) => {
            setVaultDescription(prev => {
                let newObject = { ...prev }
                let path
                if (e.target.name == "name") {
                    removeFromArray(newObject, `severities.${severityIndex}.contracts-covered`, index)
                    path = `severities.${severityIndex}.contracts-covered.${index}.${e.target.value}`
                } else if (e.target.name == "severities") {
                    path = `severities.${severityIndex}.contracts-covered.${index}.${e.target.name}`
                } else if (e.target.name == "address") {
                    path = `severities.${severityIndex}.contracts-covered.${index}.${e.target.name}`
                }
                setPath(newObject, path, value)
                return newObject
            })
        })
    }

    function severitiesToContracts(severities: ISeverity[]): { [key: string]: string } {
        const contracts = {}
        for (let severity of severities) {
            severity["contracts-covered"].forEach(contract => {
                let contractName = Object.keys(contract)[0]
                contracts[contractName] = contract[contractName]

            })
        }
        return contracts
    }

    let contracts = severitiesToContracts(vaultDescription.severities)
    console.log(contracts)

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

    contracts = severitiesToContracts(vaultDescription.severities)

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
                            {(Object.entries(contracts) || []).map((contract, index) =>
                                <ContractCovered
                                    key={index}
                                    contract={{ [contract[0]]: contract[1] }}
                                    severities={vaultDescription.severities}
                                    activeSeverities={vaultDescription.severities.filter(severity => severity["contracts-covered"].find(contractCovered => contractCovered[contract[0]]))}
                                    index={index}
                                    onChange={onChangeContract}
                                    onRemove={removeContract}
                                />)}

                            <button className="fill" onClick={addContract}>
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
                    <button onClick={() => {
                        uploadVaultDescription(vaultDescription)
                    }} className="fill">{t("VaultEditor.save-button")}</button>
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