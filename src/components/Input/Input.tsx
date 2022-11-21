import React from "react";
import styled from "styled-components";

import { Input as InputAnt, InputProps } from "antd";

interface InputPropsStyled {
  width?: string;
  height?: string;
}
const InputStyled = styled(InputAnt)<InputPropsStyled>`
  /* height: ${(props) => props.height || "40px"}; */

  padding: 8px !important;
  width: ${(props) => props.width || "100%"};
  font-family: Sarabun !important;
`;

interface Props extends InputProps, InputPropsStyled {
  onChange?: (v: any) => void;
  width?: string;
  height?: string;
}
function Input({ ...props }: Props): JSX.Element {
  return <InputStyled {...props} />;
}

export default Input;
