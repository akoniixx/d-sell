/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select as AntSelect } from "antd";
import React from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { CaretDownOutlined } from "@ant-design/icons";
import color from "../../resource/color";
const { Option } = AntSelect;
interface Props {
  data: {
    key: string;
    value?: string;
    label?: string;
  }[];
  onChange?: (v: any) => void;
  setValue?: (value: any) => void;

  defaultValue?: string | number;
  value?: string | number;
  disabled?: boolean;
  edit?: boolean;
  placeholder?: string;
}

const AntSelectCustom = styled(AntSelect)`
  .ant-select-selector {
    height: 40px !important;
    display: flex;
    align-items: center;
    font-family: Sarabun !important;
  }
  .ant-select-selection-placeholder {
    font-family: Sarabun !important;
  }

  .ant-select-selection-item {
    border-radius: 4px;
    font-family: Sarabun !important;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
`;
// const Icon = styled.img<{ open: boolean }>`
//   ${({ open }) => {
//     if (open) {
//       return css`
//         transition: all 0.3s linear;
//         -ms-transform: rotate(180deg);
//         -moz-transform: rotate(180deg);
//         -webkit-transform: rotate(180deg);
//         transform: rotate(180deg);
//       `;
//     }
//     return css`
//       -moz-transition: all 2s linear;
//       -webkit-transition: all 2s linear;
//       transition: all 0.3s linear;
//     `;
//   }}
// `;
function Select({
  data = [],
  onChange,
  setValue,
  defaultValue,
  value,
  disabled = false,
  placeholder = "กรุณาเลือก",
}: Props): JSX.Element {
  return (
    <AntSelectCustom
      dropdownStyle={{ fontFamily: "Sarabun" }}
      onChange={(e) => {
        onChange?.(e);
        setValue?.(e);
      }}
      placeholder={placeholder}
      suffixIcon={
        <CaretDownOutlined
          style={{
            color: color.Text1,
            fontSize: "20px",
          }}
        />
      }
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
    >
      {data.map((item) => {
        return (
          <Option key={item.key} value={item.value ? item.value : item.key}>
            <Text>{item.label}</Text>
          </Option>
        );
      })}
    </AntSelectCustom>
  );
}

export default Select;
