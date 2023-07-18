import styled from "styled-components";
import color from "../../resource/color";

export const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 28px;
  height: 100%;
`;

export const GroupCardContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  height: 100%;
  margin-bottom: 16px;

  .ant-card-head {
    padding: 12px !important;
    background-color: ${color.secondary};
    color: #fff;
  }
  .ant-card-head-title {
    padding: 0px !important;
  }
  .ant-card-body {
    padding: 0px !important;
  }
`;
