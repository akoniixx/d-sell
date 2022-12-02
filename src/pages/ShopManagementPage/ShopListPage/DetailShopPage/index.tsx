import React from "react";
import Button from "../../../../components/Button/Button";
import { CardContainer } from "../../../../components/Card/CardContainer";
import PageTitleNested from "../../../../components/PageTitle/PageTitleNested";
import Text from "../../../../components/Text/Text";
import { FormOutlined } from "@ant-design/icons";
import AntdTabs from "../../../../components/AntdTabs/AntdTabs";

function DetailShopPage(): JSX.Element {
  const dataTabs: { key: string; label: React.ReactNode; children?: JSX.Element | undefined }[] = [
    {
      key: "detail",
      label: "รายละเอียดร้านค้า",
      children: <div>รายละเอียดร้านค้า</div>,
    },
    {
      key: "history",
      label: "ประวัติการบันทึกข้อมูล",
      children: <div>ประวัติการบันทึกข้อมูล</div>,
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
