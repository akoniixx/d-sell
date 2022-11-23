import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Input, Pagination, Row, Select, Switch, Table } from "antd";
import moment from "moment";
import { FormOutlined } from "@ant-design/icons";
import { CardContainer } from "../../components/Card/CardContainer";

const SLASH_DMY = "DD/MM/YYYY";
const KEYWORD_TYPES: KeywordType[] = [
  { id: "customerName", value: "ชื่อร้านค้า" },
  { id: "customerId", value: "รหัสสมาชิก" },
  { id: "territory", value: "เขตร้านค้า" },
];

type ShopListItem = {
  shopId: string;
  shopImage: string;
  shopName: string;
  shopAddress: string;
  memberNo: string;
  shopType: string;
  territory: string;
  discountBalance: number;
};

type KeywordType = {
  id: string;
  value: string;
};

type Query = {
  limit: number;
  offset: number;
  keywordType?: KeywordType;
  keyword?: string;
};

const ShopPage: React.FC = () => {
  const style: React.CSSProperties = {
    marginRight: "10px",
    width: "200px",
  };
  const [keyword, setKeyword] = useState("");
  const [keywordType, setKeywordType] = useState<KeywordType>(KEYWORD_TYPES[0]);

  const handleKeywordChange = (text: string) => {
    setKeyword(text);
  };

  const handleKeywordTypeChange = (id: string) => {
    const Select = KEYWORD_TYPES.find((i) => i.id === id);
    const defaultValue = KEYWORD_TYPES[0];
    setKeywordType(Select ? Select : defaultValue);
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
              <option key={k.id} value={k.id}>
                {k.value}
              </option>
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
      title: "อัพเดตล่าสุด",
      dataIndex: "date",
      key: "date",
      width: "15%",
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
      title: "ชื่อร้านค้า",
      dataIndex: "title",
      key: "title",
      width: "25%",
    },
    {
      title: "รหัสบริษัท",
      dataIndex: "number",
      key: "number",
    },
    {
      title: " เขต",
      dataIndex: "title",
      key: "title",
      width: "10%",
    },
    {
      title: "ประเภทราคา",
      dataIndex: "title",
      key: "title",
      width: "15%",
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
      <div style={{ display: "flex", marginTop: 12, marginBottom: 24 }}>
        <CardContainer>
          <PageTitle />
          <br />
          <Table
            className='rounded-lg'
            columns={columns}
            pagination={{ position: ["bottomCenter"] }}
            size='large'
            tableLayout='fixed'
          />
        </CardContainer>
      </div>
    </>
  );
};

export default ShopPage;
