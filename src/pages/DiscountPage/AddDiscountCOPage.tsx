import UploadOutlined from "@ant-design/icons/lib/icons/UploadOutlined";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  TimePicker,
  Upload,
} from "antd";
import React, { useEffect } from "react";
import { Col, Navbar, Row } from "react-bootstrap";
import { CardContainer } from "../../components/Card/CardContainer";
const moment = require("moment");

export const AddDiscountCOPage = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      startTime: moment("00.00", "HH:mm"),
      endTime: moment("23.59", "HH:mm"),
    });
  }, []);

  const onChangeSubmit = async (v: any) => {
    const formData = new FormData();
    formData.append("title", v.title);
    formData.append(
      "start_datetime",
      v.startDate.format("YYYY-MM-DD") + " " + v.startTime.format("HH:mm:ss")
    );
    formData.append(
      "end_datetime",
      v.endDate.format("YYYY-MM-DD") + " " + v.endTime.format("HH:mm:ss")
    );
    const remark =
      v.remark === "undefined" || v.remark === undefined ? "" : v.remark;
    formData.append("remark", remark);
    formData.append("file", v.file.file.originFileObj);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <CardContainer>
          <div className="d-flex align-items-center"></div>
          <div className="my-10">
            <h4>รายละเอียด Credit Memo</h4>
          </div>
          <Form
            name="promotion-form"
            form={form}
            layout="vertical"
            onFinish={(v) => onChangeSubmit(v)}
          >
            <Row>
              <Col xs="5">
                <Form.Item
                  label="ชื่อรายการ"
                  name="title"
                  rules={[{ required: true, message: "โปรดระบุชื่อรายการ" }]}
                >
                  <Input placeholder="ระบุชื่อรายการ" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs="5">
                <div className="d-flex justify-content-between">
                  <Form.Item
                    label="วันที่เริ่ม Credit Memo"
                    name="startDate"
                    rules={[
                      {
                        required: true,
                        message: "โปรดระบุวันที่เริ่ม Credit Memo",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: 266 }}
                      placeholder="ระบุวันที่เริ่ม Credit Memo"
                    />
                  </Form.Item>

                  <Form.Item
                    label="เวลาเริ่ม Credit Memo"
                    name="startTime"
                    rules={[
                      {
                        required: true,
                        message: "โปรดระบุเวลาที่เริ่ม Credit Memo",
                      },
                    ]}
                  >
                    <TimePicker style={{ width: 266 }} format="HH:mm" />
                  </Form.Item>
                </div>
              </Col>
              <Col
                xs="1"
                className="d-flex justify-content-center align-items-center"
              >
                {" - "}
              </Col>
              <Col xs="5">
                <div className="d-flex justify-content-between">
                  <Form.Item
                    label="วันที่สิ้นสุด Credit Memo"
                    name="endDate"
                    rules={[
                      {
                        required: true,
                        message: "*โปรดระบุวันที่สิ้นสุด Credit Memo",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: 266 }}
                      placeholder="ระบุวันที่สิ้นสุด Credit Memo"
                    />
                  </Form.Item>

                  <Form.Item
                    label="เวลาสิ้นสุด Credit Memo"
                    name="endTime"
                    rules={[
                      {
                        required: true,
                        message: "โปรดระบุเวลาที่สิ้นสุด Credit Memo",
                      },
                    ]}
                  >
                    <TimePicker format="HH:mm" style={{ width: 266 }} />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row className="mt-20">
              <Col xs="6">
                <Form.Item
                  name="file"
                  label={<h4>ไฟล์ Credit Memo</h4>}
                  rules={[
                    {
                      required: true,
                      message: "โปรดเลือกไฟล์ที่ต้องการสร้าง Credit Memo",
                    },
                  ]}
                >
                  <Upload name="file" accept=".xlsx," maxCount={1}>
                    <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item name="remark" label="หมายเหตุเพิ่มเติม">
                  <Input.TextArea
                    placeholder="ระบุหมายเหตุเพิ่มเติม"
                    style={{ height: 122 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="d-flex flex-row align-items-center justify-content-between">
              <div>
                <p style={{ fontSize: 14, color: "#BABCBE" }}>
                  โปรดตรวจสอบข้อมูลพนักงานก่อนบันทึก
                </p>
              </div>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </div>
          </Form>
        </CardContainer>
      </div>
    </>
  );
};
