import { SearchOutlined } from "@ant-design/icons";
import { Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { CardContainer } from "../../components/Card/CardContainer";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Text from "../../components/Text/Text";

export const HighLightNews: React.FC = () => {
  const PageTitle = (
    <Row align='middle' gutter={16}>
      <Col span={9}>
        <Text level={3} fontWeight={700}>
          แจ้งเตือนโปรโมชัน
        </Text>
      </Col>
      <Col span={6}>
        <Input
          placeholder='ค้นหาชื่อข่าวสาร'
          suffix={<SearchOutlined style={{ color: "grey" }} />}
          //onChange={(e) => setSearch(e.target.value)}
        />
      </Col>
      <Col span={5}>
        <Select
          allowClear
          placeholder='เลือกแอปพลิเคชัน'
          data={[]}
          style={{ width: "100%" }}
          //onChange={(e) => searchApp(e)}
        />
      </Col>
      <Col>
        <Button
          type='primary'
          title='+ เพิ่มการแจ้งเตือน'
          height={40}
          //onClick={() => setShowModal(!showModal)}
        />
      </Col>
    </Row>
  );
  return (
    <CardContainer>
      {PageTitle}
      <br />
      <Table
        className='rounded-lg'
        columns={[]}
        scroll={{ x: "max-content" }}
        //dataSource={dataPromotion?.data}
        size='large'
        tableLayout='fixed'
        //   pagination={{
        //     position: ["bottomCenter"],
        //     pageSize: take,
        //     current: page,
        //     total: dataPromotion?.count,
        //     onChange: (p) => setPage(p),
        //     showSizeChanger: false,
        //   }}
      /> 
      </CardContainer>
  );
};
