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
}
function InputHyphen({ onChange, ...props }: Props): JSX.Element {
  const onChangeWithHyphen = (e: any) => {
    const value: string = e.target.value;
    const newValue = value.replace(/[^0-9-]/g, "").toString();
    if (newValue.length === 1 || newValue.length === 7 || newValue.length === 12) {
      onChange?.(newValue + "-");
    } else {
      onChange?.(newValue);
    }
  };
  return <InputStyled onChange={onChangeWithHyphen} {...props} />;
}

export default InputHyphen;
