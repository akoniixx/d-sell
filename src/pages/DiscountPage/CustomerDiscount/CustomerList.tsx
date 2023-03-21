import React, { useEffect, useState, memo } from "react";
import { Table, Tabs, Modal, Switch, Row, Col, Pagination } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { RangePicker } from "../../../components/DatePicker/DatePicker";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import {
  getCreditMemoList,
  getCustomerCreditMemoList,
} from "../../../datasource/CreditMemoDatasource";
import moment from "moment";
import { FlexCol } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import color from "../../../resource/color";
import { priceFormatter } from "../../../utility/Formatter";

type FixedType = "left" | "right" | boolean;

export const CustomerDiscountListPage: React.FC = () => {
  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [dataState, setDataState] = useState({
    count: 0,
    count_status: [],
    data: [],
  });

  useEffect(() => {
    if (!loading) fetchData();
  }, [keyword, statusFilter, page]);

  const resetPage = () => setPage(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, count, count_status } = await getCustomerCreditMemoList({
        company,
        creditMemoShopStatus: statusFilter,
        searchText: keyword,
        take: pageSize,
        page,
      });
      setDataState({
        data: data?.map((e: any, i: number) => ({ ...e, key: i })),
        count,
        count_status,
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
        <Col className='gutter-row' xl={14} sm={12}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              Discount CO รายร้าน
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={5} sm={6}>
          <Input
            placeholder='ค้นหาร้านค้า'
            prefix={<SearchOutlined style={{ color: "grey" }} />}
            defaultValue={keyword}
            onPressEnter={(e: any) => {
              const value = (e.target as HTMLTextAreaElement).value;
              setKeyword(value);
              // resetPage();
            }}
            onChange={(e: any) => {
              const value = (e.target as HTMLInputElement).value;
              if (!value) {
                setKeyword("");
                // resetPage();
              }
            }}
            style={{ width: "100%" }}
          />
        </Col>
        <Col className='gutter-row' xl={5} sm={6}>
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
    {
      label: `ทั้งหมด (${
        dataState?.count_status?.reduce((prev, { count }) => prev + parseInt(count), 0) || 0
      })`,
      key: "ALL",
    },
    {
      label: `Active (${
        (dataState?.count_status?.find((s: any) => s.credit_memo_status) as any)?.count || 0
      })`,
      key: "true",
    },
    {
      label: `Inactive (${
        (dataState?.count_status?.find((s: any) => !s.credit_memo_status) as any)?.count || 0
      })`,
      key: "false",
    },
  ];

  const columns = [
    {
      title: "Customer Company ID",
      dataIndex: "customer_company_id",
      key: "customer_company_id",
      width: "15%",
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customer_name",
      key: "customername",
      width: "20%",
      render: (value: string, row: any) => {
        return (
          <>
            <FlexCol>
              <Text level={6}>{value}</Text>
              <Text color='Text3' level={6}>
                {row.province ? "จ." + row.province : "-"}
              </Text>
            </FlexCol>
          </>
        );
      },
    },
    {
      title: "รายชื่อสมาชิก",
      dataIndex: "firstname",
      key: "name",
      width: "20%",
      render: (firstname: string, row: any) => {
        return (
          <>
            <FlexCol>
              <Text level={6}>{`${firstname || "-"} ${row.lastname || ""}`}</Text>
            </FlexCol>
          </>
        );
      },
    },
    {
      title: "โซน",
      dataIndex: "zone",
      key: "zone",
      width: "15%",
    },
    {
      title: "ยอดคงเหลือ",
      dataIndex: "balance",
      key: "balance",
      width: "15%",
      render: (value: string, row: any) => {
        return priceFormatter(value, undefined, true);
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      width: "15%",
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => navigate("/discount/customerDetail/" + row.customer_company_id)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined style={{ color: color["primary"] }} />
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
          {/* <Tabs
            items={tabsItems}
            onChange={(key: string) => {
              setStatusFilter(key === "ALL" ? undefined : key);
              resetPage();
            }}
          /> */}
          <br />
          <Table
            className='rounded-lg'
            columns={columns}
            dataSource={dataState.data}
            pagination={{
              pageSize,
              current: page,
              onChange: (page) => setPage(page),
              position: ["bottomCenter"],
            }}
            size='large'
            tableLayout='fixed'
            loading={loading}
          />
        </CardContainer>
      </div>
    </>
  );
};
