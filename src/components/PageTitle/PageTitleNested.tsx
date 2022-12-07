import { Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import icon from "../../resource/icon";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import Text from "../Text/Text";

interface Props {
  title: string;
  extra?: React.ReactNode;
  showBack?: boolean;
  extraTitle?: React.ReactNode;
  customBreadCrumb?: React.ReactNode;
}
const BackImage = styled.img`
  width: 30px;
  height: 30px;
`;
const ContainerBackButton = styled.div`
  cursor: pointer;
`;
const ConvertTitleObj = {
  SaleManagementPage: "รายชื่อพนักงาน",
  AddSale: "เพิ่มรายชื่อพนักงาน",
  RoleManagementPage: "จัดการสิทธิตำแหน่งผู้ใช้งาน",
  AddNewRole: "เพิ่มตำแหน่ง",
};
const ExtraTitleContainer = styled.div`
  margin-left: 12px;
`;
const PageTitleNested = ({ title, extra, showBack = true, extraTitle, customBreadCrumb }: Props) => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const currentPathSplit = currentPath.split("/").filter((el) => el !== "");
  const data = currentPathSplit
    .map((el, idx) => {
      const path = currentPathSplit.slice(0, idx + 1).join("/");
      const text = ConvertTitleObj[el as keyof typeof ConvertTitleObj];
      return {
        text,
        path: "/" + path,
      };
    })
    .filter((el) => el.path !== "/UserPage");
  return (
    <Row justify='space-between'>
      <Col>
        <Row
          style={{
            alignItems: "flex-start",
          }}
          gutter={16}
        >
          {showBack && (
            <Col>
              <ContainerBackButton onClick={() => navigate(-1)}>
                <BackImage src={icon.backLeft} />
              </ContainerBackButton>
            </Col>
          )}
          <Col>
            <Row align='middle'>
              <Text level={2} color='Text2'>
                {title}
              </Text>
              {extraTitle && <ExtraTitleContainer>{extraTitle}</ExtraTitleContainer>}
            </Row>
            <Row>
              {customBreadCrumb ? customBreadCrumb : <BreadCrumb data={data} />}
            </Row>
          </Col>
        </Row>
      </Col>
      {extra && <Col>{extra}</Col>}
    </Row>
  );
};
export default PageTitleNested;
