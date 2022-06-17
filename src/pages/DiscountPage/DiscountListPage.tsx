import React, { useEffect, useState, memo } from "react";
import {
  Table,
  Tabs,
  Modal,
  DatePicker,
  Switch,
  Input,
  Row,
  Col,
  Button,
  Pagination,
} from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import {
  DeleteOutlined,
  FormOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Container } from "react-bootstrap";
import Layouts from "../../components/Layout/Layout";

const { RangePicker } = DatePicker;
const moment = require("moment");
const SLASH_DMY = "DD/MM/YYYY";

export const DiscountListPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };
  const _ = require("lodash");
  const [memoList, setMemoList] = useState([]);
  const [meta, setMeta] = useState();
  const [keyword, setKeyword] = useState("");
  const [isModalDeleteVisible, setIsModalDeleteVisible] =
    useState<boolean>(false);

  const PageTitle = () => {
    return (
      <Container>
        <Row>
          <Col className="gutter-row" span={12}>
            <div>
              <span
                className="card-label font-weight-bolder text-dark"
                style={{ fontSize: 14 }}
              >
                Discount Lists-รายการเพิ่ม/ลด Memo
              </span>
            </div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div style={style}>
              <Input
                placeholder="ค้นหา Credit Memo"
                prefix={<SearchOutlined />}
                value={keyword}
              />
            </div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div style={style}>
              <Input.Group compact>
                <DatePicker.RangePicker />
              </Input.Group>
            </div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div>
              <Button
                type="primary"
                onClick={() => (window.location.href = "/")}
              >
                เพิ่มไฟล์ Credit Memo
              </Button>
            </div>
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

  const columns = [
    {
      title: "อัพเดตล่าสุด",
      dataIndex: "title",
      key: "title",
      width: "10%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "title",
      key: "title",
      width: "15%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "ขนาด",
      dataIndex: "title",
      key: "title",
      width: "5%",
    },
    {
      title: "กลุ่มสินค้า",
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
      width: "10%",
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
      render: (value: any, row: any, index: number) => {
        return {
          children: <Switch checked={row.is_active} />,
        };
      },
    },
  ];

  return (
    <Layouts>
      <div className="container ">
        <PageTitle />
        <br />
        <CardContainer>
          <Table
            className="rounded-lg"
            columns={columns}
            dataSource={memoList}
            pagination={{ position: ["bottomCenter"] }}
            size="large"
            tableLayout="fixed"
          />
          <br />
          <div className="d-flex justify-content-end pt-10">
            <Pagination
              defaultCurrent={1}
              // total={meta?.totalItem}
              // current={Number(meta?.currentPage)}
              // onChange={(p) => fetchCreditMemoList(p)}
            />
          </div>
        </CardContainer>
      </div>

      <Modal
        visible={isModalDeleteVisible}
        onCancel={() => setIsModalDeleteVisible(false)}
      >
        <p style={{ color: "#464E5F", fontSize: 24 }}>
          ต้องการลบข้อมูลตำแหน่งผู้ใช้งานนี้
        </p>
        <p style={{ color: "#BABCBE", fontSize: 16 }}>
          โปรดยืนยันการลบข้อมูลรายการ Credit Memo
        </p>
      </Modal>
    </Layouts>
  );
};
