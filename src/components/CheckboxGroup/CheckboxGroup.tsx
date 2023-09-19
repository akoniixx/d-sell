import { Checkbox, Form, Row } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import React from "react";
import styled from "styled-components";
import color from "../../resource/color";
import Text from "../Text/Text";
import CheckboxNested from "./CheckboxNested";

interface Props {
  nameKey?: string;
  data: {
    value: string;
    label: string;
    [key: string]: any;
    groupNameNested?: string;

    listNested?: {
      value: string;
      label: string;
    }[];
  }[];
  isNested?: boolean;

  onChange?: (value: CheckboxValueType[]) => void;
  value?: CheckboxValueType[];
  name?: string;
  disabled?: boolean;
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 24px;
`;
export const CheckBoxStyled = styled(Checkbox)<{ disabled?: boolean; isGroup?: boolean }>`
  .ant-checkbox-checked {
    background-color: ${({ disabled }) => (disabled ? color.Text3 : color.primary)} !important;
    border-radius: 4px !important;
  }
  .ant-checkbox-inner {
    width: 24px !important;
    height: 24px !important;
    border-radius: 4px !important;
    border-color: ${color.background2} !important;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${({ disabled }) => (disabled ? color.Text3 : color.primary)} !important;
    border-color: ${({ disabled }) => (disabled ? color.Text3 : color.primary)} !important;
    border-radius: 4px !important;
  }
  .ant-checkbox-inner::after {
    width: 8px;
    background-color: ${({ disabled }) => (disabled ? color.Text3 : color.primary)} !important;
    height: 14px;
  }
  .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: ${color.white} !important;
  }
`;
export const CheckboxG = CheckBoxStyled.Group;
export default function CheckboxGroup({
  value,
  data,
  onChange,
  name,
  disabled = false,
  isNested,
  nameKey = "",
}: Props) {
  return (
    <Container>
      {isNested ? (
        <div>
          <CheckBoxStyled
            isGroup
            disabled={disabled}
            checked={
              Object.keys(value || {})
                .map((key) => value?.[key as keyof typeof value])
                .flat().length > 0
            }
            onChange={() => {
              if (
                Object.keys(value || {})
                  .map((key) => value?.[key as keyof typeof value])
                  .flat().length > 0
              ) {
                const genObj = data.reduce((acc: any, item: any) => {
                  const { groupNameNested = "" } = item;
                  acc[groupNameNested] = [];
                  return acc;
                }, {});
                onChange?.(genObj);
              } else {
                const genObj = data.reduce((acc: any, item: any) => {
                  const { groupNameNested = "", listNested = [] } = item;
                  acc[groupNameNested] = listNested.map((item: { value: string }) => item.value);
                  return acc;
                }, {});
                onChange?.(genObj);
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
          <div
            style={{
              display: "grid",
              marginLeft: 24,
              alignItems: "flex-start",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {data.map((item) => {
              const { groupNameNested = "", listNested = [] } = item;
              return (
                <Row key={groupNameNested}>
                  <Form.Item noStyle name={[nameKey, groupNameNested]}>
                    <CheckboxNested data={listNested} disabled={disabled} name={item.label} />
                  </Form.Item>
                </Row>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <CheckBoxStyled
            isGroup
            disabled={disabled}
            checked={value && value?.length > 0}
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
            disabled={disabled}
            onChange={(value) => {
              onChange && onChange(value);
            }}
            value={value}
          >
            {data.map((item) => {
              return (
                <CheckBoxStyled
                  disabled={disabled}
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
                    <Text level={6}>{item.label}</Text>
                  </div>
                </CheckBoxStyled>
              );
            })}
          </CheckboxG>
        </>
      )}
    </Container>
  );
}
