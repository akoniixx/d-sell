import React from "react";
import { Radio as RadioAntd } from "antd";
import styled from "styled-components";

const RadioStyled = styled(RadioAntd)``;
interface Props extends React.ComponentProps<typeof RadioAntd.Group> {
  items: {
    value: string;
    label: string;
    key?: string;
  }[];
}
function Radio({ ...props }: Props): JSX.Element {
  return (
    <RadioStyled.Group {...props}>
      {props.items.map((item, idx) => (
        <RadioAntd key={item.key || idx} value={item.value}>
          {item.label}
        </RadioAntd>
      ))}
    </RadioStyled.Group>
  );
}

export default Radio;
