import React, { useEffect, useState, memo } from "react";
import { Table, Tabs, Modal, Switch, Row, Col, Pagination } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { SearchOutlined } from "@ant-design/icons";
import { RangePicker } from "../../components/DatePicker/DatePicker";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { getCreditMemoList } from "../../datasource/CreditMemoDatasource";
import moment from "moment";
import { nameFormatter } from "../../utility/Formatter";

const SLASH_DMY = "DD/MM/YYYY";

export const DiscountListPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };
  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState<any>();
  const [statusFilter, setStatusFilter] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [dataState, setDataState] = useState({
    count: 0,
    count_status: [],
    data: [],
  });

  useEffect(() => {
    if (!loading) fetchProduct();
  }, [keyword, statusFilter, dateFilter, page]);

  const resetPage = () => setPage(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, count, count_status } = await getCreditMemoList({
        company,
        creditMemoStatus: statusFilter,
        startDate: dateFilter && dateFilter[0] ? moment(dateFilter[0]).subtract(543, 'years').format(SLASH_DMY) : undefined,
        endDate: dateFilter && dateFilter[1] ? moment(dateFilter[1]).subtract(543, 'years').format(SLASH_DMY) : undefined,
        searchText: keyword,
        take: pageSize,
        page,
      });
      setDataState({
        data,
        count,
        count_status
      });
      console.log({ data });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

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
            onClick={() => navigate(`/discount/create`)}
          />
        </Col>
      </Row>
    );
  };

  const tabsItems = [
    { label: `ทั้งหมด(${dataState?.count_status?.reduce((prev, { count }) => prev + parseInt(count), 0) || 0})`, key: "ALL" },
    ...(dataState?.count_status?.map(({ product_freebies_status, count }) => ({
      label: nameFormatter(product_freebies_status) + `(${count})`,
      key: product_freebies_status,
    })) || []).reverse(),
  ];

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
            dataSource={dataState.data}
            pagination={{ 
              pageSize,
              current: page,
              position: ["bottomCenter"] 
            }}
            size='large'
            tableLayout='fixed'
          />
        </CardContainer>
      </div>
    </>
  );
};
