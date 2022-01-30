import './index.scss'
import PasteIcon from '../../../../assets/icons/paste.icon.svg'
import { forwardRef } from 'react'
function PastableContent(props, ref) {
    return (
        <div className="pastable-content">
            <div
                ref={ref}
                {...props}
                contentEditable >
            </div>
            <img alt="paste" src={PasteIcon} onClick={() => {
                navigator.clipboard.readText().then(text => {
                    ref.current!.textContent = text
                })
            }} />
        </div>)
}

export default forwardRef(PastableContent)