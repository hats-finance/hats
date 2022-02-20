import React from 'react';
import { t } from "i18next";
import AddIcon from "assets/icons/add.icon.svg";
import './IconEditor.scss'

const IconInput = ({ value, onChange, name }: {
    value: string | undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    name?: string
}) => {
    return (
        <>
            <div className="icon-input">
                <input
                    id={`icon-input-${name}`}
                    className="hide-file-input"
                    name={name}
                    accept="image/*"
                    type="file"
                    onChange={onChange}
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
                            src={value}
                            alt="Thumb"
                        />
                    </label>
                )}
            </div>
        </>
    );
};

export default IconInput