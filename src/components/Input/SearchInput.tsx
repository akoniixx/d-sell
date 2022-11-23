import { Input } from "antd";
import React from "react";
import styled from "styled-components";
import { SearchOutlined } from "@ant-design/icons";
import color from "../../resource/color";
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
  const Suffix = () => {
    return (
      <SearchOutlined
        style={{
          color: color.Text3,
        }}
      />
    );
  };
  return (
    <InputSearchStyled
      suffix={<Suffix />}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  );
}

export default SearchInput;
