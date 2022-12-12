import React from "react";
import Button from "../../../../components/Button/Button";
import { CardContainer } from "../../../../components/Card/CardContainer";
import PageTitleNested from "../../../../components/PageTitle/PageTitleNested";
import Text from "../../../../components/Text/Text";
import { FormOutlined } from "@ant-design/icons";
import AntdTabs from "../../../../components/AntdTabs/AntdTabs";
import DetailTab from "./DetailTab";
import HistoryTab from "./HistoryTab";
import { useNavigate, useParams } from "react-router-dom";

function DetailShopPage(): JSX.Element {
  const { shopId } = useParams();
  const navigate = useNavigate();
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
        description={
          <Text
            fontWeight={500}
            level={6}
            style={{
              marginTop: 8,
            }}
          >
            รหัสสมาชิก: 11009388577
          </Text>
        }
        extra={
          <Button
            onClick={() => {
              navigate(`EditShopPage`);
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

export default DetailShopPage;
