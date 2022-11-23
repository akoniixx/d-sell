import React from "react";
import styled from "styled-components";
import { Switch as SwitchA } from "antd";

const SwitchStyled = styled(SwitchA)``;
interface Props {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
function Switch({ onChange, checked }: Props): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  return (
    <SwitchStyled
      checked={checked}
      loading={loading}
      onChange={() => {
        setLoading(true);
        setTimeout(() => {
          onChange && onChange(!checked);
          setLoading(false);
        }, 500);
      }}
    />
  );
}

export default Switch;
