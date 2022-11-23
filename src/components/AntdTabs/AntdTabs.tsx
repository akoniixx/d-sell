import React, { ReactNode } from "react";
import { Tabs } from "antd";

import styled from "styled-components";
import color from "../../resource/color";

interface Props {
  data: {
    key: string;
    label: string | ReactNode;
    children?: JSX.Element;
  }[];
  defaultTab?: string;
  onChange?: (v: string) => void;
}

const Container = styled.div`
  margin-top: 24px;
  .ant-tabs-large > .ant-tabs-nav .ant-tabs-tab {
    padding: 8px 16px;
  }
  .tabs {
    .ant-tabs-tab + .ant-tabs-tab {
      margin-left: 16px !important;
    }
    .ant-tabs-tab-btn {
      font-size: 14px;
      color: ${color.Text1};
      font-weight: 400;
      font-family: "IBM Plex Sans Thai", "Helvetica", sans-serif;
      :hover {
        color: ${color.primary} !important;
      }
      :focus {
        font-weight: 700;
        color: ${color.Text2} !important;
      }
      :active {
        font-weight: 700;
        color: ${color.Text2} !important;
      }
    }
    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${color.Text2} !important;

      font-size: 14px;
      font-weight: 700;
      font-family: "IBM Plex Sans Thai", "Helvetica", sans-serif;
    }
    .ant-tabs-ink-bar {
      background: ${color.primary};
      height: 2px;
    }
  }
`;
function AntdTabs({ data = [], defaultTab, onChange }: Props): JSX.Element {
  return (
    <Container>
      <Tabs activeKey={defaultTab} items={data} className='tabs' size='large' onChange={onChange} />
    </Container>
  );
}

export default AntdTabs;
