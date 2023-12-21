import { Checkbox, Col, Divider, Form, Modal, Row, Table } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import { color } from "../../../resource";
import Text from "../../../components/Text/Text";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { SearchOutlined } from "@ant-design/icons";
import Button from "../../../components/Button/Button";
import { ModalSelectStore } from "../../Shared/ModalSelectStore";
import { StoreEntity } from "../../../entities/StoreEntity";
import { getCustomers } from "../../../datasource/CustomerDatasource";
import TableContainer from "../../../components/Table/TableContainer";

export function CreateShopGroup() {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const navigate = useNavigate();
  const [form] = useForm();
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [showModal, setModal] = useState(false);

  const [showModalShop, setShowModalShop] = useState<boolean>(false);
  const [selectedShop, setSelectedShop] = useState<StoreEntity[]>([]);
  const [searchShop, setSearchShop] = useState<StoreEntity[]>([]);

  const callBackShop = (item: StoreEntity[]) => {
    console.log(item);
    item = item.map((p: any) => ({ ...p, isChecked: false }));
    setSelectedShop([...selectedShop, ...item]);
    setSearchShop([...selectedShop, ...item]);
    setShowModalShop(!showModalShop);
  };

  const columns: any = [
    {
      title: isEdit && (
        <Checkbox
          //onClick={(e) => handleAllCheckBox(e)}
          checked={
            selectedShop.length > 0 || searchShop.length > 0
              ? selectedShop.every((x) => x.isChecked) || searchShop.every((x) => x.isChecked)
              : false
          }
        />
      ),
      width: "5%",
      dataIndex: "index",
      render: (text: string, value: any) => (
        <Checkbox
          checked={value.isChecked}
          // onClick={(e) => handleCheckBox(e, value.productId)}
        />
      ),
    },
    {
      title: "รหัสร้านค้า",
      dataIndex: "customerNo",
      key: "customerNo",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row gutter={8}>
              <Text>{value}</Text>
            </Row>
          ),
        };
      },
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      width: "50%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row gutter={8}>
              <Text>{value}</Text>
            </Row>
          ),
        };
      },
    },
    {
      title: "เขตการขาย",
      dataIndex: "zone",
      key: "zone",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row>
              <Text level={5}>{value}</Text>
            </Row>
          ),
        };
      },
    },
  ];

  return (
    <CardContainer>
      <PageTitleNested
        title={isEdit ? "รายการกลุ่มร้านค้า" : "เพิ่มกลุ่มร้านค้า"}
        showBack
        onBack={() => navigate(`/ShopManagementPage/ShopGroupPage`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการกลุ่มร้านค้า", path: `/ShopManagementPage/ShopGroupPage` },
              {
                text: isEdit ? "รายการกลุ่มร้านค้า" : "เพิ่มกลุ่มร้านค้า",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
      <Divider />
      <Form form={form} layout='vertical' onFinish={() => setModal(true)}>
        <Row>
          <Col span={10}>
            <Form.Item
              name='groupname'
              label={<Text fontWeight={600}>ชื่อกลุ่มร้านค้า</Text>}
              rules={[
                {
                  required: true,
                  message: "*โปรดระบุชื่อกลุ่มสินค้า",
                },
              ]}
            >
              <Input placeholder='ระบุชื่อกลุ่มสินค้า' autoComplete='off' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Row>
        <Col span={10}>
          <Text fontWeight={600}>เพิ่มร้านค้าเข้ากลุ่ม</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={4}>
          <Select
            allowClear
            placeholder='เขตทั้งหมด'
            data={[
              { key: true, value: true, label: "เปิดใช้งาน" },
              { key: false, value: false, label: "ปิดใช้งาน" },
            ]}
            style={{ width: "100%" }}
            onChange={(e) => {
              //setIsActive(e);
            }}
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder='ค้นหาชื่อร้านค้า'
            prefix={<SearchOutlined style={{ color: "grey" }} />}
            //onChange={(e) => setSearch(e.target.value)}
            autoComplete='off'
          />
        </Col>
        <Col span={3}>
          <Button
            title='ล้างการค้นหา'
            typeButton='primary-light'
            //onClick={onClearSearchShop}
          />
        </Col>
        <Col span={8}></Col>
        <Col span={3}>
          <Button title='+ เพิ่มร้านค้า' onClick={() => setShowModalShop(!showModalShop)} />
        </Col>
      </Row>
      <br />
      <Row justify={"space-between"} gutter={8}>
        <Col span={21}></Col>
        <Col span={3}>
          <Text>จำนวนร้านค้า {selectedShop.length} ร้าน</Text>
        </Col>
      </Row>
      <br />
      <TableContainer>
        <Table
          scroll={{ y: 480 }}
          columns={isEdit ? columns : columns.filter((x: any) => x.dataIndex !== "index")}
          dataSource={searchShop}
          pagination={false}
          style={{ height: "450px" }}
        />
      </TableContainer>
      <Divider />
      <Row justify='space-between' gutter={12}>
        <Col xl={3} sm={6}>
          <Button
            typeButton='primary-light'
            title='ยกเลิก'
            htmlType='submit'
            onClick={() => navigate(`/ShopManagementPage/ShopGroupPage`)}
          />
        </Col>
        <Col xl={15} sm={6}></Col>
        <Col xl={3} sm={6}>
          <Button typeButton='primary' title='บันทึก' htmlType='submit' />
        </Col>
      </Row>
      {setShowModalShop && (
        <ModalSelectStore
          company={company}
          callBackShop={callBackShop}
          showModalShop={showModalShop}
          onClose={() => setShowModalShop(!setShowModalShop)}
          currentSelectShop={selectedShop}
        />
      )}
      {showModal && (
        <Modal
          centered
          open={showModal}
          closable={false}
          //onOk={saveBrand}
          onCancel={() => setModal(false)}
          destroyOnClose
          okText={"ยืนยัน"}
          cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
        >
          <Text level={2}>
            {isEdit ? "ยืนยันบันทึกแบรนด์สินค้า" : "ยืนยันการเพิ่มกลุ่มร้านค้า"}
          </Text>
          <br />
          {isEdit ? (
            <>
              <Text level={5} color='Text3'>
                โปรดตรวจสอบรายละเอียดกลุ่มสินค้าอีกครั้งก่อนกดยืนยัน
              </Text>
              <br />
              <Text level={5} color='Text3'>
                เพราะอาจส่งผลต่อการแสดงผลข้อมูลในระบบ
              </Text>
            </>
          ) : (
            <Text level={5} color='Text3'>
              โปรดตรวจสอบรายละเอียดก่อนกดยืนยัน
            </Text>
          )}
        </Modal>
      )}
    </CardContainer>
  );
}
