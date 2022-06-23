import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import {
  Button,
  Col,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Switch,
  Table,
} from "antd";
import moment from "moment";
import { FormOutlined, ShopOutlined } from "@ant-design/icons";
import { CardContainer } from "../../components/Card/CardContainer";
import Layouts from "../../components/Layout/Layout";
import { useLocalStorage } from "../../hook/useLocalStorage";
import { formatDate } from "../../utilities/TextFormatter";
import TextArea from "antd/lib/input/TextArea";
import { ShopDatasource } from "../../datasource/ShopDatasource";

const SLASH_DMY = "DD/MM/YYYY";
const KEYWORD_TYPES: KeywordType[] = [
  { id: "customerName", value: "ชื่อร้านค้า" },
  { id: "customerId", value: "รหัสสมาชิก" },
  { id: "territory", value: "เขตร้านค้า" },
];

type KeywordType = {
  id: string;
  value: string;
};

const ShopPage: React.FC = () => {
  const style: React.CSSProperties = {
    marginRight: "10px",
    fontFamily: "Sukhumvit set",
    fontSize: "14px",
    fontWeight: "bold",
  };
  const [keyword, setKeyword] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [keywordType, setKeywordType] = useState<KeywordType>(KEYWORD_TYPES[0]);
  const [persistedProfile, setPersistedProfile] = useLocalStorage(
    "profile",
    []
  );
  useEffect(() => {
    fetchCustomerList(1, 10, persistedProfile.companyId);
  }, []);

  const fetchCustomerList = async (
    pageNum: number,
    pageSize: number,
    companyId: number
  ) => {
    await ShopDatasource.getCustomer(pageNum, pageSize, companyId).then(
      (res) => {
        setCustomerList(res.data);
        console.log(res);
      }
    );
  };

  const PageTitle = () => {
    return (
      <Row>
        <Col span={14}>
          <span style={{ fontSize: 20, fontWeight: "bold" }}>
            Shop Price List - ราคาพิเศษจากร้านค้า
          </span>
        </Col>
        <Col span={4} style={style}>
          <Input
            placeholder={`ค้นหา${keywordType.value}`}
            //  onChange={(e) => handleKeywordChange(e.target.value)}
          ></Input>
        </Col>
        <Col span={4} style={style}>
          <Select
            defaultValue={KEYWORD_TYPES[0].id}
            // onChange={(e: any) => handleKeywordTypeChange(e.target.value)}
          >
            {KEYWORD_TYPES.map((k) => (
              <option value={k.id}>{k.value}</option>
            ))}
          </Select>
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
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      width: "30%",
      sorter: (a: any, b: any) => sorter(a.customerName, b.customerName),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="d-flex flex-row align-items-baseline">
              <div>
                <span style={{ fontSize: "20px", marginRight: "10px" }}>
                  <ShopOutlined />
                </span>
                <span style={{ fontWeight: "bold" }}>{row.customerName}</span>
                <p style={{ fontSize: "12px", color: "#7B7B7B" }}>
                  {row.address + " "}
                  {row.district + " "}
                  {row.subdistrict + " "}
                  {"จ." + row.province}
                </p>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: "รหัสสมาชิก",
      dataIndex: "customerNoNAV",
      key: "customerNoNAV",
      width: "15%",
      sorter: (a: any, b: any) => sorter(a.customerNoNAV, b.customerNoNAV),
    },
    {
      title: " เขต",
      dataIndex: "saleZone",
      key: "saleZone",
      width: "10%",
    },
    {
      title: "ประเภทราคา",
      dataIndex: "statusCusPrice",
      key: "statusCusPrice",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div>
              <Button type="primary" ghost>
                {row.statusCusPrice}
              </Button>
            </div>
          ),
        };
      },
    },
    {
      title: "อัพเดตล่าสุด",
      dataIndex: "updateDate",
      key: "updateDate",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <span className="text-dark-75  text-hover-primary mb-1 font-size-lg">
                {formatDate(row.updateDate)}
              </span>
            </>
          ),
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
              <div className="d-flex flex-row justify-content-between">
                <div
                  className="btn btn-icon btn-light btn-hover-primary btn-sm"
                  onClick={() =>
                    (window.location.href = "/ShopDetailPage?=" + row.customerId)
                  }
                >
                  <span className="svg-icon svg-icon-primary svg-icon-2x">
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
    <Layouts>
      <div
        style={{
          display: "flex",
          marginTop: 12,
          marginBottom: 24,
          fontFamily: "Sukhumvit set",
        }}
      >
        <CardContainer>
          <PageTitle />
          <br />
          <Table
            className="rounded-lg"
            columns={columns}
            dataSource={customerList}
            pagination={{ position: ["bottomCenter"] }}
            size="large"
            tableLayout="fixed"
          />
        </CardContainer>
      </div>
    </Layouts>
  );
};

export default ShopPage;
