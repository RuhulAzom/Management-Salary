
type Props = {
    heading: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: string,
    disabled?: boolean,
    required?: boolean
}

export default function InputNumber({ heading, placeholder, onChange, value, disabled, required }: Props) {
    return (
        <div className="input-poster flex flex-col gap-[.5rem]">
            <p>
                {heading}
            </p>
            <input type="number" placeholder={`${placeholder}`} className="px-[1rem] py-[.7rem] rounded-[.5rem] outline-none border border-main-gray-border w-full" onChange={(e) => onChange(e)} value={value} disabled={disabled ? true : false} required={required ? true : false} />
        </div>
    )
}