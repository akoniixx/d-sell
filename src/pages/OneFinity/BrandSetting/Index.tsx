import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Col, Image, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { CardContainer } from "../../../components/Card/CardContainer";
import Permission from "../../../components/Permission/Permission";
import Button from "../../../components/Button/Button";
import Text from "../../../components/Text/Text";
import Input from "../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { dateFormatter } from "../../../utility/Formatter";
import { color } from "../../../resource";
import image from "../../../resource/image";

export const IndexBrandSetting: React.FC = () => {
  const navigate = useNavigate();

  const mockData = [
    {
      id: 1,
      logo: image.icp_international,
      brand: "ท็อปวัน",
      updateBy: "รชยา ช่างภักดี",
      updateDate: Date(),
    },
  ];

  const ActionBtn = ({ onClick, icon }: any) => {
    return (
      <Col span={6}>
        <div className='btn btn-icon btn-light btn-hover-primary btn-sm' onClick={onClick}>
          <span
            className='svg-icon svg-icon-primary svg-icon-2x'
            style={{ color: color["primary"] }}
          >
            {icon}
          </span>
        </div>
      </Col>
    );
  };

  const PageTitle = (
    <Row align='middle' gutter={16}>
      <Col span={3}>
        <Text level={3} fontWeight={700}>
          แบรนด์สินค้า
        </Text>
      </Col>
      <Col span={18}>
        <Input
          placeholder='ค้นหาชื่อแบรนด์สินค้า'
          prefix={<SearchOutlined style={{ color: "grey" }} />}
        />
      </Col>
      <Permission permission={["oneFinity", "create"]}>
        <Col className='gutter-row' span={3}>
          <Button
            type='primary'
            title='+ เพิ่มแบรนด์สินค้า'
            height={40}
            onClick={() => navigate("/oneFinity/createBrandSetting/create")}
          />
        </Col>
      </Permission>
    </Row>
  );

  const columns: any = [
    {
      title: "ยี่ห้อ/แบรนด์สินค้า",
      dataIndex: "brand",
      key: "brand",
      width: "60%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"space-between"}>
              <Col span={4}>
                <Image
                  src={row.logo}
                  height={60}
                  width={60}
                  style={{ borderRadius: "5px", objectFit: "cover" }}
                />
              </Col>
              <Col span={20}>
                <Text>{value}</Text>
              </Col>
            </Row>
          ),
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
              {" "}
              <Badge count={"เปิดใช้งาน"} style={{ backgroundColor: color.success }} />
            </Row>
          ),
        };
      },
    },
    {
      title: "อัพเดทโดย",
      dataIndex: "updateBy",
      key: "updateBy",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Text level={5}>{dateFormatter(row.updateDate, true)}</Text>
              <br />
              <Text level={5}>{value}</Text>
            </>
          ),
        };
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
              <ActionBtn
                onClick={() => navigate(`/oneFinity/create/${row.id}`)}
                icon={<EditOutlined />}
              />
            </Row>
          ),
        };
      },
    },
  ];

  return (
    <CardContainer>
      {PageTitle}
      <br />
      <Table
        columns={columns}
        dataSource={mockData}
        pagination={{
          position: ["bottomCenter"],
          // pageSize,
          // current: page,
          // total: dataState.count,
          // onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
      />
    </CardContainer>
  );
};
