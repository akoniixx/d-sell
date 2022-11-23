import React, { useEffect, useState, memo } from "react";
import {
  Table,
  Tabs,
  Modal,
  DatePicker,
  Switch,
  Row,
  Col,
  Input,
  Button,
  Select,
  Pagination,
} from "antd";
import Navbar from "../../components/Navbar/Navbar";
import { CardContainer } from "../../components/Card/CardContainer";
import { FormOutlined } from "@ant-design/icons";
import moment from "moment";
import { Option } from "antd/lib/mentions";
import * as _ from "lodash";
const { RangePicker } = DatePicker;
const SLASH_DMY = "DD/MM/YYYY";
const { TabPane } = Tabs;

export const DistributionPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const [optionalTextSearch, setTextSearch] = useState<string>();
  const [memoList, setMemoList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState<boolean>(false);
  const changeTextSearch = (text?: string) => {
    setTextSearch(text);
  };

  const PageTitle = () => {
    return (
      <Row>
        <Col className='gutter-row' span={12}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              Distribution (DIS) Price List-ราคาสินค้า
            </span>
          </div>
        </Col>
        <Col className='gutter-row' span={4}>
          {/* <div style={style}>
              <Input
                placeholder="ค้นหาชื่อสินค้า"
                prefix={<SearchOutlined style={{ color: "grey" }} />}
                value={keyword}
              />
            </div> */}
        </Col>
        <Col className='gutter-row' span={4}>
          <div>
            <Select defaultValue='เลือกกลุ่มสินค้า' style={style} onChange={handleChange}>
              <Option value='Fert'>Fert</Option>
              <Option value='Inter'>Inter</Option>
              <Option value='Ladda'>Ladda</Option>
            </Select>
          </div>
        </Col>
        <Col className='gutter-row' span={4}>
          <div>
            <Select defaultValue='เลือก Strategy Group' style={style} onChange={handleChange}>
              {/* <Option value="รายการคำสั่งซื้อทั้งหมด">
                  รายการคำสั่งซื้อทั้งหมด
                </Option>
                <Option value="รอการอนุมัติคำสั่งซื้อ">
                  รอการอนุมัติคำสั่งซื้อ
                </Option>
                <Option value="รอยืนยันคำสั่งซื้อ">รอยืนยันคำสั่งซื้อ</Option>
                <Option value="ยืนยันคำสั่งซื้อแล้ว">
                  ยืนยันคำสั่งซื้อแล้ว
                </Option>
                <Option value="เปิดรายการคำสั่งซื้อ">
                  เปิดรายการคำสั่งซื้อ
                </Option>
                <Option value="กำลังจัดส่ง">กำลังจัดส่ง</Option>
                <Option value="ลูกค้ารับสินค้าแล้ว">ลูกค้ารับสินค้าแล้ว</Option>
                <Option value="ยกเลิกคำสั่งซื้อโดยร้านค้า">
                  ยกเลิกคำสั่งซื้อโดยร้านค้า
                </Option>
                <Option value="ไม่อนุมัติคำสั่งซื้อ">
                  ไม่อนุมัติคำสั่งซื้อ
                </Option> */}
            </Select>
          </div>
        </Col>
      </Row>
    );
  };

  const sorter = (a: any, b: any) => {
    if (a === b) return 0;
    else if (a === null) return 1;
    else if (b === null) return -1;
    else return a.localeCompare(b);
  };

  const columns = [
    {
      title: "อัพเดตล่าสุด",
      dataIndex: "date",
      key: "date",
      width: "12%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className='test'>
              <span className='text-dark-75 font-size-lg'>
                {moment(row.start_datetime).format(SLASH_DMY)} -{" "}
              </span>
              <span className='text-dark-75 font-size-lg '>
                {moment(row.end_datetime).format(SLASH_DMY)}
              </span>
            </div>
          ),
        };
      },
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "title",
      key: "title",
      width: "18%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "ขนาด",
      dataIndex: "number",
      key: "number",
    },
    {
      title: " กลุ่มสินค้า",
      dataIndex: "title",
      key: "title",
      width: "10%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "Strategy Group",
      dataIndex: "title",
      key: "title",
      width: "15%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "ราคาต่อหน่วย",
      dataIndex: "title",
      key: "title",
      width: "13%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "ราคาตลาด",
      dataIndex: "title",
      key: "title",
      width: "10%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "10%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
      render: (value: any, row: any, index: number) => {
        return {
          children: <Switch checked={row.is_active} />,
        };
      },
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      width: "5%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => (window.location.href = "/EditCreditMemoPage?id=" + row.id)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <FormOutlined />
                  </span>
                </div>
              </div>
            </>
          ),
        };
      },
    },
  ];

  return (
    <>
      <div className='container '>
        <PageTitle />
        <br />
        <CardContainer>
          <Table
            className='rounded-lg'
            columns={columns}
            dataSource={memoList}
            pagination={{ position: ["bottomCenter"] }}
            size='large'
            tableLayout='fixed'
          />
          <br />
          <div className='d-flex justify-content-end pt-10'>
            <Pagination
              defaultCurrent={1}
              // total={meta?.totalItem}

              // current={Number(meta?.currentPage)}
              // onChange={(p) => fetchCreditMemoList(p)}
            />
          </div>
        </CardContainer>
      </div>

      <Modal visible={isModalDeleteVisible} onCancel={() => setIsModalDeleteVisible(false)}>
        <p style={{ color: "#464E5F", fontSize: 24 }}>ต้องการลบข้อมูลตำแหน่งผู้ใช้งานนี้</p>
        <p style={{ color: "#BABCBE", fontSize: 16 }}>โปรดยืนยันการลบข้อมูลรายการ Credit Memo</p>
      </Modal>
    </>
  );
};
