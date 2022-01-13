import { useRef } from "react"
import { IStoredKey } from "../../types/types"
import { generateKey } from 'openpgp'


export default function NewKey({ addKey }: { addKey: (newKey: IStoredKey) => any }) {
    const aliasRef = useRef<HTMLInputElement>(null)
    const passphraseRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)


    async function _handleClick() {
        const alias = aliasRef.current!.value
        const passphrase = passphraseRef.current?.value
        const name = nameRef.current?.value
        const email = emailRef.current?.value
        const { privateKey } = await generateKey({
            type: 'rsa', // Type of the key, defaults to ECC
            rsaBits: 2048,
            //curve: 'curve25519', // ECC curve name, defaults to curve25519
            userIDs: { name, email }, // { name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
            passphrase: passphrase, // protects the private key
            format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
        });
        addKey({ alias, privateKey, passphrase })
    }

    return <div className="new-key">
        <div className="title">
            <p>Hello committee member</p>
        </div>
        <div className="subtitle">
            <p>Please generate private and public PGP keys by creating an alias and a passphrase.</p>
        </div>
        <div className="alias">
            <p>Alias</p>
            <input ref={aliasRef} type="text" placeholder="Enter new alias" />
        </div>
        <div className="details">
            <div className="details-name">
                <p>Name</p>
                <input ref={nameRef} type="text" placeholder="Enter your name" />
            </div>
            <div className="details-email">
                <p>Email</p>
                <input ref={emailRef} type="text" placeholder="Enter your email" />
            </div>
        </div>
        <div className="passphrase">
            <p>Passphrase</p>
            <p className="description">Please notice,your passphrase isn’t saved to local storage! please save it as you see fit.</p>
            <input ref={passphraseRef} type="text" placeholder="Enter new passphrase" />
            <p className="hint">Min 6 chars</p>
        </div>
        <div className="submit">
            <button onClick={_handleClick}>Generate key pair </button>
        </div>
    </div>
}