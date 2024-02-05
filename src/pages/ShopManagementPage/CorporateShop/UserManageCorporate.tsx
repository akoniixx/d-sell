import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Col, Divider, Form, Modal, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AntdTabs from "../../../components/AntdTabs/AntdTabs";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import Input from "../../../components/Input/Input";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Select from "../../../components/Select/Select";
import TableContainer from "../../../components/Table/TableContainer";
import Text from "../../../components/Text/Text";
import { color } from "../../../resource";

function UserCorporateShop(): JSX.Element {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("wait");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showCancel, setShowCancel] = useState<boolean>(false);

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
  const changeTab = (name?: string) => {
    setTab(name || "");
  };
  const PageTitle = () => {
    return (
      <PageTitleNested
        title='จัดการผู้ใช้งานลูกค้า'
        showBack
        onBack={() => navigate(`/ShopManagementPage/CorporateShop`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายชื่อร้านค้า", path: `/ShopManagementPage/CorporateShop` },
              { text: "จัดการผู้ใช้งานลูกค้า", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };
  const dataTabs: { key: string; label: React.ReactNode; onClick: () => void }[] = [
    {
      key: "wait",
      label: "รออนุมัติ",
      onClick: () => changeTab("wait"),
    },
    {
      key: "active",
      label: `อนุมัติแล้ว`,
      onClick: () => changeTab("active"),
    },
    {
      key: "unapproved",
      label: "ไม่อนุมัติ",
      onClick: () => changeTab("unapproved"),
    },
    {
      key: "inactive",
      label: "ปิดการใช้งาน",
      onClick: () => changeTab("inactive"),
    },
  ];
  const mockHis = [
    {
      no: "864A48FF84",
      name: "รชยา ช่างภักดี",
      telephone: "0938355808",
      role: "เจ้าของร้าน",
    },
  ];
  const columns: any = [
    {
      title: "รหัสลูกค้า",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "ผู้ใช้งาน",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "telephone",
      key: "telephone",
    },
    {
      title: "บทบาท",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "จัดการ",
      dataIndex: "",
      key: "",
      width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"center"} gutter={16}>
              <ActionBtn
                icon={<EditOutlined />}
                onClick={() => {
                  setIsEdit(true);
                  setShowModal(true);
                }}
              />
              <ActionBtn icon={<DeleteOutlined />} onClick={() => setShowCancel(true)} />
            </Row>
          ),
        };
      },
    },
  ];

  return (
    <>
      <CardContainer>
        <PageTitle />
        <br />
        <div
          style={{
            marginTop: 24,
          }}
        >
          <AntdTabs data={dataTabs} onChange={changeTab} />
          <Row justify={"space-between"} gutter={8}>
            <Col span={3}>
              <Text>จำนวนผู้ใช้ทั้งหมด</Text>
            </Col>
            <Col span={3}>
              <Text>2 ผู้ใช้</Text>
            </Col>
            <Col span={tab === "wait" ? 8 : 11}></Col>
            <Col span={3}>
              <Select placeholder='บทบาท : ทั้งหมด' data={[]} style={{ width: "100%" }} />
            </Col>
            <Col span={4}>
              <Input
                placeholder='ค้นหาชื่อผู้ใช้/เบอร์โทร'
                autoComplete='off'
                suffix={<SearchOutlined style={{ fontSize: "20px", color: color.Disable }} />}
              />
            </Col>
            {tab === "wait" && (
              <Col span={3}>
                <Button
                  title='เพิ่มผู้ใช้งาน'
                  icon={<PlusOutlined style={{ color: color.white }} />}
                  onClick={() => {
                    setIsEdit(false);
                    setShowModal(!showModal);
                  }}
                />
              </Col>
            )}
          </Row>
          <br />
          <TableContainer>
            <Table
              columns={columns}
              dataSource={mockHis || []}
              pagination={false}
              // pagination={{
              //   total: historyData.length,
              //   current: page,
              //   pageSize: 10,
              //   onChange: (page) => {
              //     setPage(page);
              //   },
              //}}
            />
          </TableContainer>
        </div>
      </CardContainer>
      {showModal && (
        <Modal
          open={showModal}
          onCancel={() => setShowModal(!showModal)}
          footer={false}
          width={500}
          title={
            <Text level={4} fontWeight={700}>
              {isEdit ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}
            </Text>
          }
        >
          <Form layout='vertical' form={form}>
            <Col span={24}>
              <Form.Item
                name={"name"}
                label='ชื่อผู้ใช้งาน'
                rules={[
                  {
                    required: true,
                    message: "*กรุณาระบุชื่อผู้ใช้งาน",
                  },
                ]}
              >
                <Input placeholder='ระบุชื่อผู้ใช้งาน' autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"telephone"}
                label='เบอร์โทร'
                rules={[
                  {
                    required: true,
                    message: "*กรุณาระบุเบอร์โทร",
                  },
                ]}
              >
                <Input placeholder='ระบุชื่อผู้ใช้งาน' autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"rolw"}
                label='บทบาท'
                rules={[
                  {
                    required: true,
                    message: "*กรุณาเลือกบทบาท",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder='เลือกบทบาท'
                  data={[]}
                  //onChange={(e) => selectedPromotion(e)}
                  //disabled={isDisable}
                />
              </Form.Item>
            </Col>
            {isEdit && (
              <>
                <Col span={24}>
                  <Text fontSize={16} fontWeight={600}>
                    อัปเดทโดย
                  </Text>
                </Col>
                <Col span={24}>
                  <Text fontSize={16}>รชยา ช่างภักดี, 22/11/2566, 14.58 น.</Text>
                </Col>
                <Col span={24}>
                  <Text fontSize={16} fontWeight={600}>
                    สถานะการตรวจสอบ
                  </Text>
                </Col>
                <Col span={24}>
                  <Text fontSize={16}>{tab}</Text>
                </Col>
              </>
            )}
            <Divider />
            <Row justify='space-between' gutter={12}>
              <Col xl={4} sm={6}>
                <Button
                  typeButton='primary-light'
                  title='ยกเลิก'
                  onClick={() => setShowModal(false)}
                />
              </Col>
              <Col xl={16} sm={12}></Col>
              <Col xl={4} sm={6}>
                <Button
                  typeButton='primary'
                  title='บันทึก'
                  //onClick={() => createNoti()}
                />
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
      {showCancel && (
        <Modal
          centered
          open={showCancel}
          closable={false}
          onOk={() => navigate(`/freebies/freebies`)}
          onCancel={() => setShowCancel(false)}
          destroyOnClose
          okText={"ยืนยัน"}
          cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
        >
          <Text level={2}>ต้องการยืนยันการลบผู้ใช้งาน</Text>
          <br />
          <Text level={5} color='Text3'>
            โปรดตรวจสอบรายละเอียดผู้ใช้อีกครั้ง ก่อนการกดยืนยันการลบ
          </Text>
        </Modal>
      )}
    </>
  );
}

export default UserCorporateShop;
