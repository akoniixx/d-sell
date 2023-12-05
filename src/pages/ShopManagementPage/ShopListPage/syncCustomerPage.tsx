import { ConfigProvider, Divider, Row, Table } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import { color } from "../../../resource";

const Header = styled(Row)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
`;

function SyncCustomerPage(): JSX.Element {
  const navigate = useNavigate();

  const mockData = [
    {
      cusname: "บริษัท รวมใจกันนะ จำกัด",
      detail: [
        { key: "icpi", company: "ICP International", username: "คุณ XXX", phone: "098XXXXXXX" },
        { key: "icpf", company: "ICP Fertilizer", username: "คุณ XXX", phone: "098XXXXXXX" },
        { key: "icpl", company: "ICP Ladda", username: "คุณ XXX", phone: "096XXXXXXX" },
      ],
    },
    {
      cusname: "หจก. รุ่งเจริญ ยังนะ",
      detail: [
        { key: "icpi", company: "ICP International", username: "คุณ YYY", phone: "098XXXXXXX" },
        { key: "icpf", company: "ICP Fertilizer", username: "คุณ YYY", phone: "093XXXXXXX" },
        { key: "icpl", company: "ICP Ladda", username: "คุณ AAA", phone: "044XXXXXXX" },
      ],
    },
  ];
  const columns = [
    {
      title: "ชื่อร้านค้า",
      dataIndex: "cusname",
      key: "cusname",
      render: (value: string, row: any) => {
        return <Text>{value}</Text>;
      },
    },
    {
      title: "ICP International",
      dataIndex: "icpi",
      key: "icpi",
      render: (value: string, row: any) => {
        const map = row?.detail.find((x) => x.key === "icpi");
        return (
          <>
            <Text>{map.username}</Text>
            <br />
            <Text>{map.phone}</Text>
          </>
        );
      },
    },
    {
      title: "ICP Fertilizer",
      dataIndex: "icpf",
      key: "icpf",
      render: (value: string, row: any) => {
        const map = row?.detail.find((x) => x.key === "icpf");
        return (
          <>
            <Text>{map.username}</Text>
            <br />
            <Text>{map.phone}</Text>
          </>
        );
      },
    },
    {
      title: "ICP Ladda",
      dataIndex: "icpl",
      key: "icpl",
      render: (value: string, row: any) => {
        const map = row?.detail.find((x) => x.key === "icpl");
        return (
          <>
            <Text>{map.username}</Text>
            <br />
            <Text>{map.phone}</Text>
          </>
        );
      },
    },
  ];
  return (
    <CardContainer>
      <PageTitleNested
        title='รายละเอียดเบอร์โทรศัพท์'
        //cutParams
        onBack={() => {
          navigate("/ShopManagementPage/ShopListPage");
        }}
        extra={<></>}
      />
      <Divider />
      <Header>
        <Text color='error' fontWeight={700} fontSize={18}>
          กรุณาตรวจสอบความถูกต้องของเบอร์โทรศัพท์ ตามรายการดังนี้
        </Text>
      </Header>
      <br />
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: color.primary,
              headerColor: color.white,
            },
          },
        }}
      >
        <Table dataSource={mockData} columns={columns} pagination={false} />
      </ConfigProvider>
    </CardContainer>
  );
}

export default SyncCustomerPage;
