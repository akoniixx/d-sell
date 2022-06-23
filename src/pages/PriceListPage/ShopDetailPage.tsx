import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { CardContainer } from "../../components/Card/CardContainer";
import Layouts from "../../components/Layout/Layout";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Search from "antd/lib/input/Search";
import { Option } from "antd/lib/mentions";
import { Container, Placeholder } from "react-bootstrap";
import { ShopDatasource } from "../../datasource/ShopDatasource";
import { useLocalStorage } from "../../hook/useLocalStorage";

const _ = require("lodash");
let queryString = _.split(window.location.search, "=");

export const ShopDetailPage: React.FC = () => {
  const style: React.CSSProperties = {
    marginBottom: "20px",
    fontFamily: "Sukhumvit set",
  };
  const [detailProductCus, setDetailProductCus] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { RangePicker } = DatePicker;
  const [persistedProfile, setPersistedProfile] = useLocalStorage(
    "profile",
    []
  );

  useEffect(() => {
    fetchProductCus(1, 10, persistedProfile.customerId);
  }, []);

  const fetchProductCus = async (
    pageNum: number,
    pageSize: number,
    customerId: number
  ) => {
    await ShopDatasource.getByCusPriceId(pageNum, pageSize, customerId).then(
      (res) => {
        setDetailProductCus(res);
        console.log(res);
      }
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const PageTitle = () => {
    return (
      <Container>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row">
            <span
              onClick={() => (window.location.href = "/ShopPage")}
              style={{ color: "#0068F4", fontSize: "20px" }}
            >
              <ArrowLeftOutlined />
            </span>
          </Col>
          <Col className="gutter-row" span={6}>
            <span
              className="card-label font-weight-bolder text-dark"
              style={{
                fontFamily: "Sukhumvit set",
                fontSize: "25px",
                fontWeight: "bold",
              }}
            >
              บริษัทชัยสิริจำกัด
            </span>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row">
            <span
              className="card-label font-weight-bolder text-dark"
              style={{ fontFamily: "Sukhumvit set", fontSize: "14px" }}
            >
              192 หมู่ที่ 19
            </span>
          </Col>
        </Row>
        <br />
        <Row justify="center" style={style}>
          <Col span={4}>
            <Search
              style={{ width: 170 }}
              placeholder="ค้นหาสินค้า"
              //onSearch={changeTextSearch}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder={"เลือกกลุ่มสินค้า"}
              style={{ width: 170 }}
              //onChange={handleGroupProduct}
              //value={selectProductGroup}
            >
              <Option value="">ALL</Option>
              {/* {productGroup?.map((items: any, index: number) => (
                      <Option key={index} value={items}>
                        {items}
                      </Option>
                    ))} */}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder={"เลือก Strategy Group"}
              style={{ width: 170 }}
              //   onChange={handleStrategyProduct}
              //   value={selectStrategyProduct}
            >
              <Option value="">ALL</Option>
              {/* {productStrategy?.map((items: any, index: number) => (
                    <Option key={index} value={items}>
                      {items}
                    </Option>
                  ))} */}
            </Select>
          </Col>
          <Col span={2}>
            <span>เลือกช่วงเวลา</span>
          </Col>
          <Col span={4} style={{ marginRight: "5px" }}>
            <Input.Group compact>
              <DatePicker.RangePicker />
            </Input.Group>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={showModal}>
              เพิ่มรายการสินค้า
            </Button>
            <Modal
              style={style}
              width={800}
              title="เพิ่มรายการสินค้า"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>เลือกช่วงวันที่เริ่มต้น - สิ้นสุด</p>
              <Row justify="start" style={style}>
                <Col span={8}>
                  <span>วันที่เริ่มต้น</span>
                </Col>
                <Col span={8}>
                  <span>วันที่สิ้นสุด</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <RangePicker showTime />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col span={12}>
                  <Search
                    placeholder="ค้นหาสินค้า"
                    style={{ width: "180px" }}
                    //onSearch={changeTextSearch}
                  />
                </Col>

                <Col span={6}>
                  <Select
                    placeholder={"เลือกกลุ่มสินค้า"}
                    style={{ width: "180px" }}
                    //onChange={handleGroupProduct}
                    //value={selectProductGroup}
                  ></Select>
                </Col>
                <Col span={6}>
                  <Select
                    placeholder={"เลือก Strategy Group"}
                    style={{ width: "180px" }}
                    //onChange={handleGroupProduct}
                    //value={selectProductGroup}
                  >
                    <Option value="">ALL</Option>
                    {/* {productGroup?.map((items: any, index: number) => (
                      <Option key={index} value={items}>
                        {items}
                      </Option>
                    ))} */}
                  </Select>
                </Col>
              </Row>
              <br />
              <Table
                className="rounded-lg"
                columns={addColumns}
                pagination={{ position: ["bottomCenter"] }}
                size="large"
                tableLayout="fixed"
              />
            </Modal>
            {/* <Button
                type="primary"
                onClick={() => (window.location.href = "/AddShopProduct")}
              >
                เพิ่มรายการสินค้า
              </Button> */}
          </Col>
        </Row>
      </Container>
    );
  };

  const sorter = (a: any, b: any) => {
    if (a === b) return 0;
    else if (a === null) return 1;
    else if (b === null) return -1;
    else return a.localeCompare(b);
  };
  const addColumns = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "productName",
      key: "productName",
      width: "20%",
    },
    {
      title: "ขนาด",
      dataIndex: "packSize",
      key: "packSize",
      width: "15%",
    },
    {
      title: " ราคาต่อหน่วย",
      dataIndex: "productGroup",
      key: "productGroup",
      width: "12%",
    },
    {
      title: "ราคาตลาด",
      dataIndex: "productStrategy",
      key: "productStrategy",
      width: "8%",
    },
    {
      title: "ราคาพิเศษ",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: "8%",
    },
  ];
  const columns = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "customerName",
      key: "customerName",
      width: "20%",
    },
    {
      title: "ขนาด",
      dataIndex: "packSize",
      key: "packSize",
      width: "15%",
    },
    {
      title: " ราคาต่อหน่วย",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: "8%",
    },
    {
      title: "ราคาตลาด",
      dataIndex: "marketPrice",
      key: "marketPrice",
      width: "8%",
    },
    {
      title: "ราคาพิเศษ",
      dataIndex: "statusCusPrice",
      key: "statusCusPrice",
      width: "8%",
    },
    {
      title: "วันเริ่มต้น",
      dataIndex: "startSpecialDate",
      key: "startSpecialDate",
      width: "10%",
    },
    {
      title: "วันสิ้นสุด",
      dataIndex: "endSpecialDate",
      key: "endSpecialDate",
      width: "10%",
    },
  ];
  return (
    <Layouts>
      <Container style={style}>
        <br />
        <PageTitle />
        <CardContainer>
          <Table
            className="rounded-lg"
            columns={columns}
            pagination={{ position: ["bottomCenter"] }}
            size="large"
            tableLayout="fixed"
          />
        </CardContainer>
      </Container>
    </Layouts>
  );
};
