import { useEffect, useState } from "react"
import { ICommitteeMember, IVaultDescription } from "types/types"
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import CommmitteeMember from "./CommitteeMember";
import ContractCovered from "./ContractCovered";
import VaultDetails from "./VaultDetails";
import CommunicationChannel from "./CommunicationChannel";
import VaultReview from "./VaultReview";
import './index.scss'
import { getPath, setPath } from "./objectUtils";
import { useParams } from "react-router-dom";
import { VaultProvider } from "components/CommitteeTools/store";
import { IPFS_PREFIX } from "constants/constants";
import { severities } from './severities'
import Loading from "components/Shared/Loading";
import { uploadVaultDescription } from "./vaultService";
interface IContract {
    name: string;
    address: string;
    severities: string[];
}

const newMember: ICommitteeMember = {
    name: "",
    address: "",
    "twitter-link": "",
    "image-ipfs-link": ""
}

const newContract: IContract = {
    name: "",
    address: "",
    severities: [],
}

const newVaultDescription: IVaultDescription = {
    "project-metadata": {
        name: "",
        icon: "",
        tokenIcon: "",
        website: "",
    },
    "communication-channel": {
        "committee-bot": "https://demo-bot-hats.herokuapp.com/broadcast-message/",
        "pgp-pk": "",
    },
    committee: {
        "multisig-address": "",
        members: [{ ...newMember }]
    },
    severities,
    source: {
        name: "",
        url: ""
    }
}

export default function VaultEditor() {
    const { t } = useTranslation();
    const [vaultDescription, setVaultDescription] = useState<IVaultDescription>(newVaultDescription)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [contracts, setContracts] = useState({ contracts: [{ ...newContract }] })
    const [loadingFromIpfs, setLoadingFromIpfs] = useState<boolean>(false)
    const [savingToIpfs, setSavingToIpfs] = useState(false)
    const [changed, setChanged] = useState(false)
    const [ipfsDate, setIpfsDate] = useState<Date | undefined>()
    const { ipfsHash } = useParams()

    const vaultName = vaultDescription["project-metadata"].name

    async function loadFromIpfs(ipfsHash) {
        try {
            setLoadingFromIpfs(true)
            const response = await fetch(IPFS_PREFIX + ipfsHash)
            const lastModified = response.headers.get('last-modified')
            if (lastModified) {
                setIpfsDate(new Date(lastModified))
            }
            const newVaultDescription = await response.json()
            severitiesToContracts(newVaultDescription)
            if ("Project-metadata" in newVaultDescription) {
                newVaultDescription["project-metadata"] = newVaultDescription["Project-metadata"]
                delete newVaultDescription["Project-metadata"]
            }
            setVaultDescription(newVaultDescription)
            setChanged(false)
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingFromIpfs(false)
        }
    }

    useEffect(() => {
        if (ipfsHash) {
            (async () => {
                await loadFromIpfs(ipfsHash)
            })();
        } else {
            // convert severities of vault description to contracts state variable
            severitiesToContracts(vaultDescription);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ipfsHash]);

    // Convert contracts state variable to severities of vault description
    useEffect(() => {
        setVaultDescription(prev => {
            let newObject = { ...prev }
            setPath(newObject, "severities", severities.map(severity =>
            ({
                ...severity,
                "nft-metadata": {
                    ...severity["nft-metadata"],
                    "description": vaultName + severity["nft-metadata"].description
                },
                "contracts-covered": contracts.contracts.filter((contract) => {
                    return contract.severities.includes(severity.name)
                }).map((contract) => ({ [contract.name]: contract.address }))
            })))
            return newObject
        })
    }, [contracts, vaultName])

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
        setChanged(true)
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
        setChanged(true)
    }

    function addPgpKey(pgpKey) {
        setVaultDescription(prev => {
            let newObject = { ...prev }
            const keys = prev["communication-channel"]["pgp-pk"]
            const sureArray = typeof keys === "string" ?
                keys === "" ? [] : [keys] :
                keys
            setPath(newObject, "communication-channel.pgp-pk", [...sureArray, pgpKey])
            return newObject
        })
        setChanged(true)
    }

    function removePgpKey(index: number) {
        const path = "communication-channel.pgp-pk"
        let value = getPath(vaultDescription, path)
        if (typeof value === "string") {
            setVaultDescription(prev => {
                let newObject = { ...prev }
                setPath(newObject, path, "")
                return newObject
            })
        } else {
            let newVaultDescription = removeFromArray(vaultDescription, "communication-channel.pgp-pk", index)
            setVaultDescription(newVaultDescription);
        }
        setChanged(true)
    }

    function removeMember(index: number) {
        let newVaultDescription = removeFromArray(vaultDescription, "committee.members", index, newMember)
        setVaultDescription(newVaultDescription);
        setChanged(true)
    }

    function addContract() {
        setContracts(prev => {
            let newObject = { ...prev }
            setPath(newObject, "contracts", [...prev.contracts, { ...newContract }])
            return newObject
        })
        setChanged(true)
    }

    function removeContract(index: number) {
        let newContracts = removeFromArray(contracts, "contracts", index, newContract)
        setContracts(newContracts);
    }

    function onContractChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setContracts(prev => {
            let newObject = { ...prev }
            setPath(newObject, e.target.name, e.target.value)
            return newObject
        })
    }

    function severitiesToContracts(vaultDescription: IVaultDescription) {
        let contracts = [] as IContract[];
        vaultDescription.severities.forEach((severity) => {
            const contractsCovered = severity["contracts-covered"]?.length === 0 ? [newContract] : severity["contracts-covered"];
            contractsCovered.forEach(item => {
                const name = Object.keys(item)[0];
                const address = Object.values(item)[0] as string;
                let contract = contracts.find(item => item.name === name && item.address === address);
                if (contract) {
                    let contractIndex = contracts.indexOf(contract)
                    contracts[contractIndex] = {
                        name,
                        address,
                        severities: [...contract.severities, severity.name]
                    };
                } else {
                    contracts.push({
                        name,
                        address,
                        severities: [severity.name]
                    });
                }
            })
        })
        setContracts({ contracts });
    }

    async function saveToIpfs() {
        try {
            setSavingToIpfs(true)
            await uploadVaultDescription(vaultDescription)
        } catch (error) {
            console.error(error)
        }
        finally {
            setSavingToIpfs(false)
        }
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

    if (loadingFromIpfs || savingToIpfs) {
        return <Loading fixed />
    }

    return (
        <div className="content vault-editor">
            <div className="vault-editor__container">
                <div className="vault-editor__title">
                    {t("VaultEditor.create-vault")}
                </div>

                <section className={classNames({ 'desktop-only': pageNumber !== 1 })}>
                    <p className="vault-editor__description">
                        {t("VaultEditor.create-vault-description")}
                    </p>
                    {ipfsDate &&
                        <div className="vault-editor__last-saved-time">
                            {`${t("VaultEditor.last-saved-time")} `}
                            {ipfsDate.toLocaleString()}
                            {`(${t("VaultEditor.local-time")})`}
                        </div>
                    }

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
                                value={vaultDescription?.committee["multisig-address"] || ''}
                                pastable
                                textInput
                                colorable
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
                                        membersCount={(vaultDescription?.committee?.members || []).length}
                                        onChange={onChange}
                                        onRemove={removeMember}
                                        addMember={addMember}
                                    />)}
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
                                {(contracts.contracts || []).map((contract, index) =>
                                    <ContractCovered
                                        key={index}
                                        contract={contract}
                                        severitiesOptions={vaultDescription.severities.map(severity => ({
                                            label: severity.name, value: severity.name
                                        }))}
                                        index={index}
                                        contractsCount={(contracts.contracts || []).length}
                                        onChange={onContractChange}
                                        onRemove={removeContract}
                                        addContract={addContract}
                                    />)}
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
                            <VaultProvider>
                                <CommunicationChannel
                                    removePgpKey={removePgpKey}
                                    communicationChannel={vaultDescription?.["communication-channel"]}
                                    addPgpKey={addPgpKey}
                                    onChange={onChange}
                                />
                            </VaultProvider>
                        </div>
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
                        </div>
                    </div>
                </section>

                <div className="vault-editor__button-container">
                    {changed && ipfsHash && <button onClick={() => loadFromIpfs(ipfsHash)} className="fill">{t("VaultEditor.reset-button")}</button>}
                    <button onClick={saveToIpfs} className="fill" disabled={!changed}>{t("VaultEditor.save-button")}</button>
                </div>

                {/* {
                    !changed && ipfsHash && <>
                        <section className={classNames({ 'desktop-only': pageNumber !== 6 })}>
                            <div className="vault-editor__section">
                                <p className="vault-editor__section-title">
                                    7. {t("VaultEditor.review-vault.title")}
                                </p>
                                <div className="vault-editor__section-content">
                                    <VaultSign message={""} onChange={null} signatures={[]} />
                                </div>
                            </div>

                            <div className="vault-editor__button-container">
                                <button onClick={sign} className="fill">{t("VaultEditor.sign-submit")}</button>
                            </div>
                        </section>
                    </>
                } */}

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
        </div >
    )
}