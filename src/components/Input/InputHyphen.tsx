import React from "react";
import styled from "styled-components";

import { Input as InputAnt, InputProps } from "antd";

interface InputPropsStyled {
  width?: string;
  align?: "left" | "center" | "right";
}
const InputStyled = styled(InputAnt)<InputPropsStyled>`
  /* height: ${(props) => props.height || "40px"}; */

  padding: 8px !important;
  width: ${(props) => props.width || "100%"};
  font-family: Sarabun !important;

  text-align: ${(props) => props.align || "left"};
`;

interface Props extends InputProps, InputPropsStyled {
  onChange?: (v: any) => void;
  width?: string;
  align?: "left" | "center" | "right";
  value?: string;
}
function InputHyphen({ onChange, value, ...props }: Props): JSX.Element {
  const onChangeWithHyphen = (e: any) => {
    const values: string = e.target.value;
    const isDelete = value && value?.toString().length > values.length;

    const newValue = values.replace(/[^0-9-]/g, "").toString();

    if ((newValue.length === 1 || newValue.length === 7 || newValue.length === 12) && !isDelete) {
      onChange?.(newValue + "-");
    } else {
      onChange?.(newValue);
    }
  };
  return <InputStyled {...props} onChange={onChangeWithHyphen} value={value} />;
}

export default InputHyphen;
