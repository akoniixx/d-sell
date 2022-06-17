import React from 'react'

interface DropdownProp {
    items: string[],
    sizeInput: string,
    onChange?: Function,
}
export const Dropdown: React.FC<DropdownProp> = ({
    items,
    sizeInput,
    onChange,
}) => {
    return (
        <>
            <div className={"col-md-" + sizeInput}>
                <select className="form-control" onChange={(e) => onChange && onChange(e)}>
                    {items.map((x) => <option>{x}</option>)}
                </select>
            </div>
        </>
    )
}
