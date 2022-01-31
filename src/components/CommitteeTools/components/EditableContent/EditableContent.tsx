import './index.scss'
import PasteIcon from '../../../../assets/icons/paste.icon.svg'
import CopyIcon from '../../../../assets/icons/copy.icon.svg'
import { forwardRef } from 'react'
function EditableContent({ pastable, copyable, ...props }:
    {
        pastable?: boolean
        copyable?: boolean
        placeholder?: string
    }, ref) {
    const extraIcons = pastable || copyable
    return (
        <div className="pastable-content">
            <div className='content-wrapper'>
                <div
                    ref={ref}
                    {...props}
                    contentEditable >
                </div>
            </div>
            {extraIcons &&
                <div className="extra-icons">
                    {pastable && <img
                        alt="paste"
                        src={PasteIcon}
                        onClick={() => {
                            navigator.clipboard.readText().then(text => {
                                ref.current!.textContent = text
                            })
                        }} />}
                    {copyable && <img
                        alt="copy"
                        src={CopyIcon}
                        onClick={() => {
                            navigator.clipboard.writeText(ref.current!.textContent)
                        }} />}
                </div>}
        </div>
    )
}

export default forwardRef(EditableContent)