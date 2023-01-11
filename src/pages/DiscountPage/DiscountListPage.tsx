import React, { useEffect, useState, memo } from "react";
import { Table, Tabs, Modal, Switch, Row, Col, Pagination } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { DeleteOutlined, EditOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { RangePicker } from "../../components/DatePicker/DatePicker";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { getCreditMemoList } from "../../datasource/CreditMemoDatasource";
import moment from "moment";
import { nameFormatter } from "../../utility/Formatter";
import { FlexCol } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import color from "../../resource/color";

const SLASH_DMY = "DD/MM/YYYY";
type FixedType = "left" | "right" | boolean;

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
        data: data?.map((e: any, i: number) => ({ ...e, key: i })),
        count,
        count_status
      });
      console.log({ data, count, count_status });
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
              onChange={(e) => {
                const value = (e.target as HTMLInputElement).value;
                if(!value) {
                  setKeyword('');
                  // resetPage();
                }
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
    { label: `ทั้งหมด (${dataState?.count_status?.reduce((prev, { count }) => prev + parseInt(count), 0) || 0 })`, key: "ALL" },
    { label: `Active (${(dataState?.count_status?.find((s: any) => s.credit_memo_status ) as any)?.count || 0 })`, key: 'true' },
    { label: `Inactive (${(dataState?.count_status?.find((s: any) => !s.credit_memo_status ) as any)?.count || 0 })`, key: 'false' },
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
      render: (value: string, row: any) => {
        return <>
          <FlexCol>
            <Text>{row.updatedAt ? moment(row.updatedAt).format(SLASH_DMY) : '-'}</Text>
            <Text color='Text3' level={6}>{value || '-'}</Text>
          </FlexCol>
        </>
      }
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
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() =>
                    navigate("/discount/detail/" + row.creditMemoId)
                  }
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() =>
                    navigate("/discount/edit/" + row.creditMemoId)
                  }
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <EditOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() =>
                    navigate("/PromotionPage/freebies/edit/" + row.productFreebiesId)
                  }
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <DeleteOutlined style={{ color: color["primary"] }} />
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
