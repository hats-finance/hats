import React, { useState } from 'react';
import { t } from "i18next";
import classNames from "classnames";
import AddIcon from "assets/icons/add.icon.svg";
import './IconEditor.scss'
import { ipfsTransformUri } from 'utils';

const IconInput = ({ value, onChange, name, colorable }: {
    value: string | undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    name?: string
    colorable?: boolean
}) => {
    const [changed, setChanged] = useState(false)

    return (
        <>
            <div className={classNames("icon-input", {
                "icon-input--changed": changed && colorable
            })}>
                <input
                    id={`icon-input-${name}`}
                    className="hide-file-input"
                    name={name}
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                        setChanged(true)
                        onChange(e)
                    }}
                />
                {!value && (
                    <label htmlFor={`icon-input-${name}`} className="add-icon">
                        <img
                            src={AddIcon}
                            width={30}
                            height={30}
                            alt="Thumb"
                        />
                        <p>{t("VaultEditor.img-placeholder")}</p>
                    </label>
                )}
                {value && (
                    <label htmlFor={`icon-input-${name}`} className="preview">
                        <img
                            src={ipfsTransformUri(value)}
                            alt="Thumb"
                        />
                    </label>
                )}
            </div>
        </>
    );
};

export default IconInput