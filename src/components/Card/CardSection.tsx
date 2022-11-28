import { Row } from "antd";
import React from "react";
import styled from "styled-components";
import color from "../../resource/color";
import Text from "../Text/Text";
const CardSectionStyled = styled.div`
  border: 1px solid ${color.background2};
  border-radius: 8px;
  margin-bottom: 24px;
  padding: 0;
`;
interface Props {
  title?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  extra?: React.ReactNode;
  leftComponent?: React.ReactNode;
}
function CardSection({ children, extra, style, title, leftComponent }: Props) {
  return (
    <CardSectionStyled style={style}>
      <Row
        style={{
          justifyContent: "space-between",
          padding: 16,
          alignItems: "center",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          backgroundColor: color.background1,
        }}
      >
        {leftComponent ? leftComponent : <Text fontWeight={700}>{title}</Text>}
        {extra}
      </Row>
      {children}
    </CardSectionStyled>
  );
}

export default CardSection;
