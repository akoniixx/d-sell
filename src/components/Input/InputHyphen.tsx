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

    onChange?.(values);
  };
  return <InputStyled maxLength={13} {...props} onChange={onChangeWithHyphen} value={value} />;
}

export default InputHyphen;
