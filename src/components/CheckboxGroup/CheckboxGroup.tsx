import { Checkbox } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import React from "react";
import styled from "styled-components";
import color from "../../resource/color";
import Text from "../Text/Text";

interface Props {
  data: {
    value: string;
    label: string;
  }[];
  onChange?: (value: CheckboxValueType[]) => void;
  value?: CheckboxValueType[];
  name?: string;
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 24px;
`;
const CheckBoxStyled = styled(Checkbox)`
  .ant-checkbox-checked {
    background-color: ${color.primary} !important;
    border-radius: 4px !important;
  }
  .ant-checkbox-inner {
    width: 24px !important;
    height: 24px !important;
    border-radius: 4px !important;
    background-color: ${color.background1} !important;
    border-color: ${color.background2} !important;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${color.primary} !important;
    border-color: ${color.primary} !important;
    border-radius: 4px !important;
  }
  .ant-checkbox-inner::after {
    width: 8px;
    background-color: ${color.primary};

    height: 14px;
  }
`;
const CheckboxG = CheckBoxStyled.Group;
export default function CheckboxGroup({ value, data, onChange, name }: Props) {
  return (
    <Container>
      <CheckBoxStyled
        checked={value?.length === data.length}
        onChange={() => {
          if (value?.length === data.length) {
            onChange?.([]);
          } else {
            onChange?.(data.map((item) => item.value));
          }
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Text level={6} fontWeight={700} fontFamily='Helvetica'>
            {name}
          </Text>
        </div>
      </CheckBoxStyled>
      <CheckboxG
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
        onChange={(value) => {
          onChange && onChange(value);
        }}
        value={value}
      >
        {data.map((item) => {
          return (
            <CheckBoxStyled
              key={item.value}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0px 24px",
              }}
              value={item.value}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <Text>{item.label}</Text>
              </div>
            </CheckBoxStyled>
          );
        })}
      </CheckboxG>
    </Container>
  );
}
