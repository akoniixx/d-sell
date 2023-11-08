import { Input } from "antd";
import React from "react";
import styled from "styled-components";
import { SearchOutlined } from "@ant-design/icons";
import color from "../../resource/color";
import icon from "../../resource/icon";
const InputSearchStyled = styled(Input)`
  border-radius: 4px !important;
  height: 40px !important;
`;

interface Props {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}
function SearchInput({ onChange, placeholder, value }: Props): JSX.Element {
  const Suffix = ({ value }: { value?: any }) => {
    return value ? (
      <div
        onClick={() => {
          onChange && onChange({ target: { value: "" } } as any);
        }}
        style={{
          width: 24,
          height: 24,
          border: "1px solid #E5EAEE",
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <img
          src={icon.iconClose}
          style={{
            width: 16,
            height: 16,
          }}
        />
      </div>
    ) : (
      <SearchOutlined
        style={{
          color: color.Text3,
        }}
      />
    );
  };
  return (
    <InputSearchStyled
      suffix={<Suffix value={value} />}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  );
}

export default SearchInput;
