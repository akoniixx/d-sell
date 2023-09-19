import { CheckboxValueType } from "antd/lib/checkbox/Group";
import React from "react";
import Text from "../Text/Text";
import { CheckboxG, CheckBoxStyled } from "./CheckboxGroup";

interface Props {
  data: {
    value: string;
    label: string;
  }[];
  isNested?: boolean;

  onChange?: (value: CheckboxValueType[]) => void;
  value?: CheckboxValueType[];
  name?: string;
  disabled?: boolean;
}

//this component use in CheckboxGroup only (not use in other component)
function CheckboxNested({ disabled, data, name, value, onChange }: Props) {
  return (
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
            marginTop: 10,
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
        value={value || []}
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
                marginTop: 4,
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
  );
}

export default CheckboxNested;
