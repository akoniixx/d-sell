import { Steps } from "antd";
import React from "react";
import styled from "styled-components";
import color from "../../resource/color";

const StepsStyled = styled(Steps)`
  .ant-steps-item-title {
    font-size: 14px;
    font-family: "IBM Plex Sans Thai", sans-serif;
  }
  .ant-steps-item-process
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title {
    font-weight: 700;
    color: ${color.secondary} !important;
  }
  .ant-steps-item-icon {
    font-family: "IBM Plex Sans Thai", sans-serif !important;
    width: 36px !important;
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding-top: 4px;
  }
  .ant-steps-item-tail {
    margin-top: 2px !important;
    padding: 3.5px 16px 0px 20px !important;
  }

  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
    background-color: ${color.white} !important;
  }
  .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon .ant-steps-icon {
    color: ${color.primary} !important;
    font-weight: 600 !important;
  }

  .ant-steps-item .ant-steps-item-wait {
    background-color: ${color.white} !important;

    :hover {
      color: ${color.primary} !important;
    }
  }
  .ant-steps-item-finish .ant-steps-item-icon {
    background-color: ${color.primary} !important;
  }
  .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
    color: ${color.white} !important;
  }

  .ant-steps-item-container {
    .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon {
      color: ${color.Text3} !important;
      font-weight: 600;
      background-color: ${color.white} !important;
    }
    :hover {
      color: ${color.primary} !important;
    }
  }
`;
interface Props extends React.ComponentProps<typeof Steps> {
  current?: number;
  onChange?: (current: number) => void;
}
function StepAntd({ current, ...props }: Props) {
  return <StepsStyled labelPlacement='vertical' {...props} current={current} />;
}

export default StepAntd;
