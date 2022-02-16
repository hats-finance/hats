import React from 'react';
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
                    name={name}
                    accept="image/*"
                    type="file"
                    onChange={onChange}
                />
                {value && (
                    <div className="preview">
                        <img
                            src={value}
                            alt="Thumb"
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default IconInput