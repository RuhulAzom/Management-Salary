import React from "react";

type Props = {
    heading: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: string,
    disabled?: boolean,
    required?: boolean,
    onFocus?: () => void,
    onBlur?: () => void,
}

export default function InputText({ heading, placeholder, onChange, value, disabled, required, onFocus, onBlur }: Props) {
    return (
        <>
            <div className="input-poster flex flex-col gap-[.5rem]">
                <p>
                    {heading}
                </p>
                <input type="text" placeholder={`${placeholder}`} className="px-[1rem] py-[.7rem] rounded-[.5rem] outline-none border border-main-gray-border w-full" onChange={(e) => onChange(e)} value={value} disabled={disabled ? true : false} required={required ? true : false}
                    onFocus={() => {
                        if (onFocus) onFocus()
                    }}
                    onBlur={() => {
                        if (onBlur) onBlur()
                    }} />
            </div>
        </>
    )
}