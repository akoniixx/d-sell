import React from "react";
import styled from "styled-components";

import { Input as InputAnt } from "antd";
import { TextAreaProps } from "antd/lib/input";

interface InputPropsStyled {
  width?: string;
  height?: string;
}
const InputStyled = styled(InputAnt.TextArea)<InputPropsStyled>`
  /* height: ${(props) => props.height || "40px"}; */

  padding: 8px !important;
  width: ${(props) => props.width || "100%"};
  font-family: Sarabun !important;
`;

interface Props extends TextAreaProps, InputPropsStyled {
  onChange?: (v: any) => void;
}
function TextArea({ ...props }: Props): JSX.Element {
  return <InputStyled {...props} rows={5} />;
}

export default TextArea;
