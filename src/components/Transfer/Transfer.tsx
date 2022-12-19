import { Transfer as AntdTransfer } from "antd";
import styled from "styled-components";
import color from "../../resource/color";

const Transfer = styled(AntdTransfer)`
    .ant-transfer-list-checkbox {
        height: 16px;
        padding-bottom: 6px;
    }
    .ant-transfer-list{
        width: calc(50% - 20px);
    }
    .ant-transfer-list-header-selected, 
    .ant-transfer-list-header-dropdown {
        width: 0;
        overflow: hidden;
        margin: 0;
    }
    .ant-transfer-list-header-title {
        text-align: left;
        padding: 0px 12px;
    }
    .ant-transfer-list-header {
        background: ${color['secondary']};
        border-radius: 4px;
        color: white;
    }
`;

export default Transfer;