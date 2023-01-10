import React from "react";
import { Steps as AntdStep } from "antd";
import styled from "styled-components";

const Steps = styled(AntdStep)`
.ant-steps-item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ant-steps-item-title {
  height: 48px;
  width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
}
.ant-steps-item-title::after {
  position: absolute;
  top: 16px;
  left: 100%;
  display: block;
  width: 100px;
} 
`;

export default Steps;