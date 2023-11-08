import React from "react";
import styled from "styled-components";
import { Switch as SwitchA } from "antd";

const SwitchStyled = styled(SwitchA)``;
interface Props {
  value?: boolean;
  onChange?: (checked: boolean) => void;
  size?: "small" | "default";
}
function Switch({ onChange, value, size }: Props): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  return (
    <SwitchStyled
      checked={value}
      loading={loading}
      style={{
        backgroundColor: "#FBFEFF",
      }}
      size={size}
      onChange={() => {
        setLoading(true);
        setTimeout(() => {
          onChange && onChange(!value);
          setLoading(false);
        }, 500);
      }}
    />
  );
}

export default Switch;
