import React from "react";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import { FormOutlined } from "@ant-design/icons";
import AntdTabs from "../../../components/AntdTabs/AntdTabs";
import { useNavigate, useParams } from "react-router-dom";

function DetailCorporateShop(): JSX.Element {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const DetailTab = () => {
    return <>detail</>;
  };

  const HistoryTab = () => {
    return <>his</>;
  };

  const dataTabs: { key: string; label: React.ReactNode; children?: JSX.Element | undefined }[] = [
    {
      key: "detail",
      label: "รายละเอียดร้านค้า",
      children: <DetailTab />,
    },
    {
      key: "history",
      label: "ประวัติการบันทึกข้อมูล",
      children: <HistoryTab />,
    },
  ];

  return (
    <CardContainer>
      <PageTitleNested
        title='รายละเอียดร้านค้า'
        cutParams
        onBack={() => {
          navigate("/ShopManagementPage/ShopListPage");
        }}
        description={
          <Text
            fontWeight={500}
            level={6}
            style={{
              marginTop: 8,
            }}
          >
            รหัสสมาชิก:
          </Text>
        }
        extra={
          <Button
            typeButton={"primary"}
            //disabled={isDisabled}
            onClick={() => {
              navigate("/ShopManagementPage/createCorporateShop/1");
            }}
            icon={
              <FormOutlined
                style={{
                  color: "white",
                  fontSize: 17,
                }}
              />
            }
            title='แก้ไขรายละเอียด'
          />
        }
      />
      <div
        style={{
          marginTop: 24,
        }}
      >
        <AntdTabs data={dataTabs} />
      </div>
    </CardContainer>
  );
}

export default DetailCorporateShop;
