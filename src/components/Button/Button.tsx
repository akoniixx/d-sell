import { Button as AntButton, ButtonProps, Row } from "antd";
import React, { CSSProperties } from "react";
import styled, { css } from "styled-components";
import color from "../../resource/color";
import Text, { TextType } from "../Text/Text";

interface StyledButton {
  $typeButton?:
    | "primary"
    | "secondary"
    | "danger"
    | "default"
    | "primary-light"
    | "border-light"
    | "disabled"
    | "success";
  height?: number;
}
const ButtonStyled = styled(AntButton)<StyledButton>`
  height: ${(props) => props.height || 40}px;

  width: 100%;
  padding: 8px 16px;
  justify-content: center;
  display: flex;
  align-items: center;
  ${({ $typeButton }) => {
    if ($typeButton === "secondary") {
      return css`
        background-color: ${color.background1} !important;
        color: white;
        border: 1px solid ${color.background1} !important;
      `;
    }
    if ($typeButton === "danger") {
      return css`
        background-color: ${color.error} !important;
        color: white;
        border: 1px solid ${color.error} !important;
        .anticon {
          color: white;
        }
      `;
    }
    if ($typeButton === "primary-light") {
      return css`
        background-color: ${color.white} !important;
        color: ${color.primary} !important;
        border: 1px solid ${color.primary} !important;
      `;
    }
    if ($typeButton === "border-light") {
      return css`
        background-color: transparent !important;
        border: 1px solid ${color.background2} !important;
      `;
    }
    if ($typeButton === "disabled") {
      return css`
        background-color: ${color.placeholder} !important;
        border: 1px solid ${color.Disable} !important;
      `;
    }
    if ($typeButton === "success") {
      return css`
        background-color: ${color.success} !important;
        color: white;
        border: 1px solid ${color.success} !important;
      `;
    }
    return css`
      background-color: ${color.primary} !important;
      color: white;
      border: 1px solid ${color.primary} !important;
    `;
  }}
`;
interface Props extends ButtonProps, StyledButton {
  title?: string;
  typeButton?:
    | "primary"
    | "secondary"
    | "danger"
    | "default"
    | "primary-light"
    | "border-light"
    | "disabled"
    | "success";
  icon?: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  textStyle?: TextType;
}
export default function Button({
  title,
  typeButton = "primary",
  icon,
  textStyle,
  ...props
}: Props): JSX.Element {
  return (
    <ButtonStyled {...props} $typeButton={typeButton}>
      <Row
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
        }}
      >
        {icon && icon}
        {title && (
          <Text
            level={props.level || 5}
            color={
              typeButton === "primary"
                ? "white"
                : typeButton === "primary-light"
                ? "primary"
                : typeButton === "disabled" || typeButton === "danger" || typeButton === "success"
                ? "white"
                : "Text1"
            }
            {...textStyle}
          >
            {title}
          </Text>
        )}
      </Row>
    </ButtonStyled>
  );
}
