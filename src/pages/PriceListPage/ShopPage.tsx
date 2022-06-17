import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Col, Input, Pagination, Row, Select, Switch, Table } from "antd";
import moment from "moment";
import { FormOutlined } from "@ant-design/icons";
import { CardContainer } from "../../components/Card/CardContainer";
import Layouts from "../../components/Layout/Layout";
import { useLocalStorage } from "../../hook/useLocalStorage";
import { CustomerDatasource } from "../../datasource/CustomerDatasource";

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
    width: "200px",
  };
  const [keyword, setKeyword] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [keywordType, setKeywordType] = useState<KeywordType>(KEYWORD_TYPES[0]);
  const [persistedProfile, setPersistedProfile] = useLocalStorage(
    "profile",
    []
  );
  const fetchCustomerList = async (companyId: number) => {
    await CustomerDatasource.getCustomer(companyId).then((res) => {
      setCustomerList(res);
      console.log(res)
    });
  };

  useEffect(() => {
    fetchCustomerList(persistedProfile.companyId);
  }, []);
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
      title: "รหัสสมาชิก",
      dataIndex: "customerNoNav",
      key: "customerNoNav",
      width: "15%",
      sorter: (a: any, b: any) => sorter(a.name, b.name),
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      width: "25%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <div className="d-flex flex-row align-items-baseline">
              <div>
                <span className="text-dark-75 d-block font-size-lg">
                  {row.customerName}
                </span>
                <span style={{ color: "GrayText", fontSize: "12px" }}>
                {"จ." + row.province}
                </span>
              </div>
            </div>
          ),
        };
      },
    },
    {
      title: "รายชื่อสมาชิก",
      dataIndex: "number",
      key: "number",
    },
    {
      title: " ICPL",
      dataIndex: "title",
      key: "title",
      width: "10%",
    },
    {
      title: "ICPF",
      dataIndex: "title",
      key: "title",
      width: "10%",
    },
    {
      title: "ICPI",
      dataIndex: "title",
      key: "title",
      width: "10%",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className="d-flex flex-row justify-content-between">
                <div
                  className="btn btn-icon btn-light btn-hover-primary btn-sm"
                  onClick={() =>
                    (window.location.href = "/EditCreditMemoPage?id=" + row.id)
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
      <div style={{ display: "flex", marginTop: 12, marginBottom: 24 }}>
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
