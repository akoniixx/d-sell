import { Collapse as AntdCollopse } from "antd";
import styled from "styled-components";
import color from "../../resource/color";

const Collapse = styled(AntdCollopse)`
    .ant-collapse-header {
        background: ${color.background1};
        padding: 0 !important;
        flex-direction: row-reverse;
        border-radius: 8px 8px 0px 0px !important;
    }
    .ant-collapse-expand-icon {
        padding: 66px 32px 66px 36px;
        background-color: white !important;
    }
    .ant-collapse-arrow {
        right: 27px !important;
    }
`;

export default Collapse;