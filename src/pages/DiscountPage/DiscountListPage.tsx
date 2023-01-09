import React, { useEffect, useState, memo } from "react";
import { Table, Tabs, Modal, Switch, Row, Col, Pagination } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { SearchOutlined } from "@ant-design/icons";
import { RangePicker } from "../../components/DatePicker/DatePicker";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

const SLASH_DMY = "DD/MM/YYYY";

export const DiscountListPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };
  const [memoList, setMemoList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState<any>();
  const [statusFilter, setStatusFilter] = useState<string>();
  const [page, setPage] = useState<number>(1);

  const resetPage = () => setPage(1);

  const PageTitle = () => {
    return (
      <Row align='middle' gutter={16}>
        <Col className='gutter-row' xl={10} sm={6}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              รายการ เพิ่ม/ลด Credit Memo
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <div style={style}>
            <Input
              placeholder='ค้นหา Credit Memo'
              prefix={<SearchOutlined style={{ color: "grey" }} />}
              defaultValue={keyword}
              onPressEnter={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                setKeyword(value);
                // resetPage();
              }}
            />
          </div>
        </Col>
        <Col className='gutter-row' xl={6} sm={6}>
          <RangePicker
            allowEmpty={[true, true]}
            enablePast
            value={dateFilter}
            onChange={(dates, dateString) => {
              setDateFilter(dates);
            }}
          />
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <Button
            type='primary'
            title='+ สร้าง Credit Memo'
            height={40}
            onClick={() => window.location.pathname = '/PromotionPage/promotion/create'}
          />
        </Col>
      </Row>
    );
  };

  const tabsItems = [
    { label: `ทั้งหมด (53)`, key: "ALL" },
    { label: `Active (22)`, key: "true" },
    { label: `Inactive (31)`, key: "false" },
  ]

  const columns = [
    {
      title: "Credit Memo Code",
      dataIndex: "creditMemoCode",
      key: "creditMemoCode",
      width: "15%",
    },
    {
      title: "ชื่อรายการ Credit Memo",
      dataIndex: "creditMemoName",
      key: "creditMemoName",
      width: "20%",
    },
    {
      title: "ระยะเวลา",
      dataIndex: "time",
      key: "time",
      width: "15%",
    },
    {
      title: "อัปเดทโดย",
      dataIndex: "updateBy",
      key: "updateBy",
      width: "10%",
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
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      width: "10%",
    },
  ];

  return (
    <>
      <div className='container '>
        <CardContainer>
        <PageTitle />
          <br />
          <Tabs
            items={tabsItems}
            onChange={(key: string) => {
              setStatusFilter(key === "ALL" ? undefined : key);
              resetPage();
            }}
          />
          <Table
            className='rounded-lg'
            columns={columns}
            dataSource={memoList}
            pagination={{ position: ["bottomCenter"] }}
            size='large'
            tableLayout='fixed'
          />
        </CardContainer>
      </div>
    </>
  );
};
