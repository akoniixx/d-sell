import styled from "styled-components";
import color from "../../resource/color";

const TableContainer = styled.div`
    border: 1px solid ${color['background2']};
    border-bottom: none;
    border-radius: 8px;
    overflow: hidden;
    .ant-table-thead > tr > th {
        background: ${color['secondary']};
        color: white;
        font-weight: 700;
    }
`
export default TableContainer;