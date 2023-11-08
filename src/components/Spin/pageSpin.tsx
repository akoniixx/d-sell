import React from "react";
import { Spin } from "antd";
import { FlexRow } from "../Container/Container";

const PageSpin = () => {
  return (
    <FlexRow align='center' justify='center' style={{ width: "100%", minHeight: 300 }}>
      <Spin size='large' />
    </FlexRow>
  );
};

export default PageSpin;
