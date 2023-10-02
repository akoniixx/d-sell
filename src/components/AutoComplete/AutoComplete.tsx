import React from "react";
import styled from "styled-components";

import { AutoComplete as AC, AutoCompleteProps } from "antd";

const AutoComplete = styled(AC)<AutoCompleteProps>`
  height: 40px;
  width: 100%;
  font-family: Sarabun !important;

  .ant-select-selector,
  .ant-select-selection-search-input {
    height: 40px !important;
  }
`;

export default AutoComplete;
