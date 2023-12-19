import { Badge, Col, Dropdown, MenuProps, Modal, Row, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { CardContainer } from "../../../components/Card/CardContainer";
import Text from "../../../components/Text/Text";
import Input from "../../../components/Input/Input";
import {
  CaretDownOutlined,
  ExperimentOutlined,
  SearchOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Permission from "../../../components/Permission/Permission";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Select from "../../../components/Select/Select";
import { color } from "../../../resource";
import styled from "styled-components";

const Header = styled(Col)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 20px;
  //display: flex;
  //gap: 16px;
  align-items: center;
  width: "100%";
`;

export const IndexShopSetting: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const items: any = [
    {
      label: <Text>เพิ่มร้านค้าจาก Navision</Text>,
      key: "1",
      onClick: () => setShowModal(true),
    },
    {
      label: <Text>เพิ่มร้านค้าใหม่</Text>,
      key: "2",
      onClick: () => setShowModal(true),
    },
  ];

  const mockData = [
    {
      id: 1,
      code: "xXx",
      shopName: "หจก. โชคดีการเกษตร",
      taxId: "1234567890123",
      name: "นางสาวรชยา ช่างภักดี",
      telephone: "0938355808",
      province: "สมุทรปราการ",
      status: true,
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

  const columns: any = [
    {
      title: "รหัสร้านค้า",
      dataIndex: "code",
      key: "code",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text level={5}>{value}</Text>,
        };
      },
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "shopName",
      key: "shopName",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Text level={5}>{value}</Text>
              <br />
              <Text level={5} color='Text3'>
                {row.taxId}
              </Text>
            </>
          ),
        };
      },
    },
    {
      title: "ชื่อเจ้าของร้าน",
      dataIndex: "name",
      key: "name",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text level={5}>{value}</Text>,
        };
      },
    },
    {
      title: "เบอร์โทร",
      dataIndex: "telephone",
      key: "telephone",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text level={5}>{value}</Text>,
        };
      },
    },
    {
      title: "จังหวัด",
      dataIndex: "province",
      key: "province",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text level={5}>{value}</Text>,
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
              <Badge count={"เปิดใช้งาน"} style={{ backgroundColor: color.success }} />
            </Row>
          ),
        };
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"space-around"} gutter={16}>
              <ActionBtn
                //onClick={() => navigate(`/oneInfinity/create/${row.id}`)}
                icon={<UnorderedListOutlined />}
              />
              <ActionBtn
                //onClick={() => navigate(`/oneInfinity/create/${row.id}`)}
                icon={<ExperimentOutlined />}
              />
            </Row>
          ),
        };
      },
    },
  ];

  const PageTitle = (
    <>
      <Row align='middle' gutter={16}>
        <Col span={20}>
          <Text level={3} fontWeight={700}>
            รายการร้านค้า
          </Text>
        </Col>
        <Permission permission={["oneInfinity", "create"]}>
          <Col className='gutter-row' span={4}>
            <Dropdown menu={{ items }}>
              <Button
                title='+ เพิ่มร้านค้าเข้าระบบ'
                iconPlacement='right'
                icon={<CaretDownOutlined style={{ color: "white" }} />}
              />
            </Dropdown>
          </Col>
        </Permission>
      </Row>
      <br />
      <Row align='middle' gutter={16}>
        <Col span={18}>
          <Input
            placeholder='ค้นหาชื่อสินค้า / ชื่อเจ้าของร้าน / เบอร์โทรศัพท์'
            prefix={<SearchOutlined style={{ color: "grey" }} />}
          />
        </Col>
        <Col span={3}>
          <Select
            allowClear
            placeholder='ทุกจังหวัด'
            data={[]}
            style={{ width: "100%" }}
            //   onChange={(e) => {
            //     setPage(1);
            //     setStatus(e);
            //   }}
          />
        </Col>
        <Col span={3}>
          <Select
            allowClear
            placeholder='เลือกสถานะ'
            data={[]}
            style={{ width: "100%" }}
            //   onChange={(e) => {
            //     setPage(1);
            //     setStatus(e);
            //   }}
          />
        </Col>
      </Row>
    </>
  );

  return (
    <>
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
      {showModal && (
        <Modal
          open={showModal}
          closable={false}
          title={<Text fontWeight={600}>เพิ่มร้านค้าจากระบบ Navision</Text>}
          centered
          onCancel={() => setShowModal(false)}
          destroyOnClose
          okText={"ยืนยัน"}
          onOk={() => navigate("/oneInfinity/createShopSetting/create")}
          //okButtonProps={{ loading: uploading }}
          cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
        >
          <Row>
            <Col span={24}>
              <Select
                placeholder='ค้นหาชื่อร้าน / หมายเลขนิติบุคคล'
                data={[]}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
          <br />
          <Header>
            <Row gutter={16}>
              <Col span={2}>
                <ShopOutlined style={{ fontSize: "20px" }} />
              </Col>
              <Col span={22}>
                <Text fontSize={16} color='primary' fontWeight={600}>
                  ร้านรวมใจการเกษตร
                </Text>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Text fontSize={14} fontWeight={500}>
                  หมายเลขนิติบุคคล
                </Text>
                <br />
                <Text fontSize={14}>9-9877-00004-32-1</Text>
              </Col>
              <Col span={12}>
                <Text fontSize={14} fontWeight={500}>
                  เบอร์โทรศัพท์
                </Text>
                <br />
                <Text fontSize={14}>089-888-9999</Text>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Text fontSize={14} fontWeight={500}>
                  เจ้าของร้าน
                </Text>
                <br />
                <Text fontSize={14}>นายกองเกียรติ ก่อกิจเกษตร</Text>
              </Col>
              <Col span={12}>
                <Text fontSize={14} fontWeight={500}>
                  จังหวัด
                </Text>
                <br />
                <Text fontSize={14}>ชัยนาท</Text>
              </Col>
            </Row>
          </Header>
        </Modal>
      )}
    </>
  );
};
