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
import { useQuery } from "react-query";
import { shopDatasource } from "../../../../datasource/ShopDatasource";
import { Spin } from "antd";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../../../store/ProfileAtom";
function DetailShopPage(): JSX.Element {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const profile = useRecoilValue(profileAtom);

  const { data, isLoading } = useQuery(["detailShop", shopId], async () => {
    return await shopDatasource.getCustomerById(shopId);
  });
  if (isLoading || !data) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  const dataTabs: { key: string; label: React.ReactNode; children?: JSX.Element | undefined }[] = [
    {
      key: "detail",
      label: "รายละเอียดร้านค้า",
      children: <DetailTab data={data} />,
    },
    {
      key: "history",
      label: "ประวัติการบันทึกข้อมูล",
      children: <HistoryTab historyData={data.history || []} />,
    },
  ];
  const isDisabled = data && data.isPending;
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
            รหัสสมาชิก: {data?.taxNo}
          </Text>
        }
        extra={
          <Button
            typeButton={isDisabled ? "disabled" : "primary"}
            disabled={isDisabled}
            onClick={() => {
              navigate({
                pathname: `EditShopPage`,
                search: `?taxId=${data?.taxNo}`,
              });
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
