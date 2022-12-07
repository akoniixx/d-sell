import { Typography } from "antd";
import { TextProps } from "antd/lib/typography/Text";
import React from "react";
import styled, { css } from "styled-components";
import color from "../../resource/color";

interface TextType {
  fontWeight?: 400 | 500 | 600 | 700
  fontSize?: 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 34 | 36 | 38 | 40 | 46 | 50;
  color?:
    | "primary"
    | "secondary"
    | "Text1"
    | "Text2"
    | "Text3"
    | "error"
    | "success"
    | "warning"
    | "white";
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  fontFamily?: "Sarabun" | "IBM Plex Sans Thai" | "Helvetica";
}
interface Props extends TextProps, TextType {
  children?: React.ReactNode;
  color?:
    | "primary"
    | "secondary"
    | "Text1"
    | "Text2"
    | "Text3"
    | "error"
    | "success"
    | "warning"
    | "white";
  fontFamily?: "Sarabun" | "IBM Plex Sans Thai" | "Helvetica";
}
const TextStyled = styled(Typography.Text)<TextType>`
  font-family: ${({ fontFamily }) => fontFamily || "IBM Plex Sans Thai"};
  color: ${(props) => color[props.color || "Text1"]};

  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 400)} !important;
  ${({ level = 5, fontWeight, fontSize }) => {
    if (fontSize) {
      return css`
        font-size: ${fontSize}px !important;
      `;
    }
    if (level === 1) {
      return css`
        font-size: 34px !important;
      `;
    }
    if (level === 2) {
      return css`
        font-size: 24px !important;
        font-weight: ${fontWeight ? fontWeight : 700} !important;
      `;
    }
    if (level === 3) {
      return css`
        font-size: 20px !important;
      `;
    }
    if (level === 4) {
      return css`
        font-size: 18px !important;
      `;
    }
    if (level === 5) {
      return css`
        font-size: 16px !important;
        ${fontWeight ? `font-weight: ${fontWeight}!important;` : ''} 
      `;
    }
    if (level === 6) {
      return css`
        font-size: 14px !important;
      `;
    }
    if (level === 7) {
      return css`
        font-size: 12px !important;
      `;
    }
  }}
`;
function Text({ children, ...props }: Props): JSX.Element {
  return <TextStyled {...props}>{children}</TextStyled>;
}

export default Text;
