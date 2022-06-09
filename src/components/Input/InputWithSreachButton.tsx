import React, { useEffect, useState } from 'react'
import {
  SearchOutlined,
} from "@ant-design/icons";

interface InputWithSerachButtonProp {
  sizeInput: string
  changeTextSearch: (text: string) => void
}

export const InputWithSerachButton: React.FC<InputWithSerachButtonProp> = ({ sizeInput, changeTextSearch }) => {
  const [text, setText] = useState<string>('')

  const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setText(text)
  }

  return (
    <div className={'col-md-' + sizeInput}>
      <form className="input-group">
        <input type="text" className="form-control" placeholder="ค้นหาสินค้า" onChange={changeText} />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              changeTextSearch(text)
            }}
          >
            <SearchOutlined/> 
          </button>
        </div>
      </form>
    </div>
  )
}
