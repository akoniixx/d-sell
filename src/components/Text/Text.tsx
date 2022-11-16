import { Typography } from "antd";
import { TextProps } from "antd/lib/typography/Text";
import React from "react";
import styled from "styled-components";

interface TextType {
  fontWeight?: 400 | 500 | 600 | 700;
}
interface Props extends TextProps, TextType {
  children?: React.ReactNode;
}
const TextStyled = styled(Typography.Text)<TextType>`
  font-family: HelveticaBold !important;
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 400)} !important;
`;
function Text({ children, ...props }: Props): JSX.Element {
  return <TextStyled {...props}>{children}</TextStyled>;
}

export default Text;
