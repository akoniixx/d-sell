import React from "react";
import { Tag as AntdTag } from "antd";
import { TagProps } from "antd/lib/tag/index";
import styled from "styled-components";

const StyledTag = styled(AntdTag)`
  margin: 0px;
  padding: 0px 12px;
  border-radius: 28px;
`;

const Tag = (props: TagProps) => {
  return <StyledTag {...props} />;
};

export default Tag;
