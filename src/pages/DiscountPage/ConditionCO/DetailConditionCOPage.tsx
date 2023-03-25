import { EditOutlined } from "@ant-design/icons";
import { Col, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import { DetailBox } from "../../../components/Container/Container";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import TableContainer from "../../../components/Table/TableContainer";
import Text from "../../../components/Text/Text";

export const DetailConditionCOPage: React.FC = () => {
  const DetailItem = ({ label, value }: { label: string; value: string }) => {
    return (
      <Row gutter={16} style={{ margin: "4px 0px" }}>
        <Col span={6}>
          <Text>{label} :</Text>
        </Col>
        <Col span={18}>
          <Text color='Text2'>{value}</Text>
        </Col>
      </Row>
    );
  };
  const PageTitle = () => {
    // TODO: isEditing
    return (
      <PageTitleNested
        title='รายละเอียดเงื่อนไข CO'
        showBack
        //onBack={() => navigate(`/price/list`)}
        extra={
          <Button
            type='primary'
            icon={<EditOutlined />}
            title='แก้ไขรายละเอียด'
            height={40}
            //onClick={() => navigate(`/price/edit/${pathSplit[3]}`)}
          />
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการเงื่อนไข CO", path: "/discount/conditionCo" },
              { text: "รายละเอียดเงื่อนไข CO", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const tabsItems = [
    {
      label: `รายละเอียดเขตและร้านค้า`,
      key: "all",
    },
    {
      label: `รายละเอียดสินค้า`,
      key: "up",
    },
  ];

  return (
    <CardContainer>
      <PageTitle />
      <br />
      <Text level={4} fontWeight={700}>
        รายละเอียดร้านค้า
      </Text>
      <DetailBox>
        <DetailItem label='ชื่อรายการ' value={""} />
        <DetailItem label='ระยะเวลา' value={""} />
      </DetailBox>
      <br/>
      <Row gutter={16}>
        <Col span={9}>
          <Text level={2}>รายละเอียด</Text>
        </Col>
        <Col span={5}></Col>
        <Col span={5}></Col>
        <Col span={5}></Col>
      </Row>
      <br />
      <Tabs items={tabsItems} />
      <TableContainer></TableContainer>
    </CardContainer>
  );
};
