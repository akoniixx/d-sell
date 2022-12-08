import { Col, Row } from "antd";
import { useMatches, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import icon from "../../resource/icon";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import Text from "../Text/Text";

interface Props {
  title: string;
  extra?: React.ReactNode;
  showBack?: boolean;
  style?: React.CSSProperties;
  cutParams?: boolean;
  description?: React.ReactNode;
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
  AddNewShop: "เพิ่มร้านค้า",
  ShopListPage: "รายชื่อร้านค้า",
  EditSale: "แก้ไขรายชื่อพนักงาน",
  EditRole: "แก้ไขตำแหน่ง",
  DetailPage: "รายละเอียดร้านค้า",
  EditShopPage: "แก้ไขรายละเอียดร้านค้า",
};
const PageTitleNested = ({
  title,
  extra,
  showBack = true,
  style,
  cutParams,
  description,
}: Props) => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const params = useParams();
  const paramsListKey = Object.keys(params);

  const currentPathSplit = cutParams
    ? currentPath
        .split("/")
        .filter((el) => el !== "")
        .slice(0, -1)
    : currentPath.split("/").filter((el) => el !== "");

  const isHaveParams = currentPathSplit.find((el) => {
    const isHave = paramsListKey.find((key) => params[key as keyof typeof params] === el);
    return isHave;
  });

  const removeBeforeMap = isHaveParams
    ? currentPathSplit
        .join("/")
        .replace(isHaveParams, "")
        .split("/")
        .filter((el) => el !== "")
    : currentPathSplit;
  const indexOfParams = isHaveParams && currentPathSplit.indexOf(isHaveParams as string);

  const data = removeBeforeMap
    .map((el, idx) => {
      const text = ConvertTitleObj[el as keyof typeof ConvertTitleObj];
      const path = currentPathSplit.slice(0, idx + 1).join("/");

      if (indexOfParams && isHaveParams && idx >= indexOfParams - 1) {
        return {
          text,
          path: "/" + currentPathSplit.slice(0, idx + 2).join("/"),
        };
      }

      return {
        text,
        path: "/" + path,
      };
    })
    .filter((el) => el.path !== "/UserPage" && el.path !== "/ShopManagementPage");
  return (
    <Row justify='space-between' style={style}>
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
            <Row>
              <Text level={2} color='Text2'>
                {title}
              </Text>
            </Row>
            <Row>
              <BreadCrumb data={data} />
            </Row>
            {description && <Row>{description}</Row>}
          </Col>
        </Row>
      </Col>
      {extra && <Col>{extra}</Col>}
    </Row>
  );
};
export default PageTitleNested;
