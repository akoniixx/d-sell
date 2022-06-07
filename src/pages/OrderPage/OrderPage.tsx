import React, { useEffect, useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import { CalendarOutlined } from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Input,
  Radio,
  Row,
  Select,
  RadioChangeEvent,
  Typography,
  Card,
} from "antd";
import { CardContainer } from "../../components/Card/CardContainer";

const { Text, Link } = Typography;
const { Option } = Select;

export function OrderPage() {
  const style: React.CSSProperties = {
    paddingRight: "10px ",
    width: "200px",
  };
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  return (
    <>
      <Container>
        <h2>Dash Board</h2>
        <Row>
          <Col span={18}>
            <Text type="secondary">รายการสั่งซื้อประจำวัน</Text>
          </Col>
          <Col span={4}></Col>
        </Row>

        <Row>
          <Col span={6}>
            <Input placeholder="SPO NO." />
          </Col>
          {/* <Col span={12} offset={6}> <Select
              defaultValue="แสดงข้อมูลทั้งหมด"
              style={style}
              onChange={handleChange}
            >
              <Option value="แสดงข้อมูลของวันนี้">แสดงข้อมูลของวันนี้</Option>
              <Option value="แสดงข้อมูลของสัปดาห์นี้">
                แสดงข้อมูลของสัปดาห์นี้
              </Option>
              <Option value="แสดงข้อมูลของเดือนนี้">
                แสดงข้อมูลของเดือนนี้
              </Option>
            </Select></Col> */}
        </Row>
        <br />
        <CardContainer>
          <Row>
            <Col span={8}>
              <span style={style}>จัดการคำสั่งซื้อ</span>
            </Col>
            <Col span={8}>
              <Select
                defaultValue="แสดงข้อมูลทั้งหมด"
                style={style}
                onChange={handleChange}
              >
                <Option value="แสดงข้อมูลของวันนี้">แสดงข้อมูลของวันนี้</Option>
                <Option value="แสดงข้อมูลของสัปดาห์นี้">
                  แสดงข้อมูลของสัปดาห์นี้
                </Option>
                <Option value="แสดงข้อมูลของเดือนนี้">
                  แสดงข้อมูลของเดือนนี้
                </Option>
              </Select>
            </Col>
            <Col span={8}>
              <Radio.Group onChange={onChange} value={value}>
                <Radio value={1}>คำสั่งซื้อรอชำระเงิน</Radio>
                <Radio value={2}>คำสั่งซื้อรออนุมัติวงเงิน</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <br />
          <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
            <thead>
              <tr>
                <th className="freezeTopic">ORDER NO.</th>
                <th className="freezeTopic">SO NO.</th>
                <th className="text-center freezeTopic">Customer</th>
                <th className="text-center freezeTopic">Sale</th>
                <th className="text-center freezeTopic">Shipment</th>
                <th className="text-center freezeTopic">Total</th>
                <th className="text-center freezeTopic">Date & Status</th>
                <th className="text-center freezeTopic">Action</th>
              </tr>
            </thead>
          </table>
        </CardContainer>
      </Container>
    </>
  );
}
