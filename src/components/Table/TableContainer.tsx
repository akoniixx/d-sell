import styled from "styled-components";
import color from "../../resource/color";

const TableContainer = styled.div`
  border: 1px solid ${color["background2"]};
  border-bottom: none;
  border-radius: 8px;
  overflow: hidden;
  .ant-table-thead > tr > th {
    background: ${color["secondary"]};
    color: white;
    font-weight: 700;
  }
  .table-row-highlight {
    background-color: ${color["secondary"]}10;
  }
  .table-row-highlight:hover td {
    background-color: ${color["secondary"]}20 !important;
  }
  .table-row-clickable {
    cursor: pointer;
  }
`;
export default TableContainer;
