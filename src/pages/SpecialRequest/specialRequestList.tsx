import React, { useEffect, useState, memo, ReactNode } from "react";
import { Table, Tabs, Modal, Switch, Row, Col, Pagination } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { RangePicker } from "../../components/DatePicker/DatePicker";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Text from "../../components/Text/Text";
import color from "../../resource/color";
import icons from "../../resource/icon";
import Select from "../../components/Select/Select";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AlignType } from "rc-table/lib/interface";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import { getOrders } from "../../datasource/OrderDatasourc";
import { OrderStatusKey } from "../../definitions/orderStatus";
import { numberFormatter, priceFormatter } from "../../utility/Formatter";
import { OrderEntity } from "../../entities/OrderEntity";
import { getOrderStatus, getSpecialRequestStatus } from "../../utility/OrderStatus";
import Tag from "../../components/Tag/Tag";

const SLASH_DMY = "DD/MM/YYYY";

type tabKey = "all" | "pending" | "approved" | "rejected";

export const SpecialRequestList: React.FC = () => {
  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [dateFilter, setDateFilter] = useState<any>();
  const [dataState, setDataState] = useState({
    data: [],
    statusCount: {
      COMPANY_CANCEL_ORDER: 0,
      CONFIRM_ORDER: 0,
      DELIVERY_SUCCESS: 0,
      IN_DELIVERY: 0,
      OPEN_ORDER: 0,
      REJECT_ORDER: 0,
      SHOPAPP_CANCEL_ORDER: 0,
      WAIT_APPROVE_ORDER: 0,
      WAIT_CONFIRM_ORDER: 0,
    },
    count: 0,
  });
  const [selectedTab, setSelectedTab] = useState<tabKey>("all");

  useEffect(() => {
    if (!loading) fetchData();
  }, []);

  useEffect(() => {
    if (selectedTab === "all") {
      setStatusFilter(undefined);
    } else if (selectedTab === "pending") {
      setStatusFilter(["WAIT_APPROVE_ORDER"]);
    } else if (selectedTab === "approved") {
      setStatusFilter([
        "COMPANY_CANCEL_ORDER",
        "CONFIRM_ORDER",
        "DELIVERY_SUCCESS",
        "IN_DELIVERY",
        "OPEN_ORDER",
        "SHOPAPP_CANCEL_ORDER",
        "WAIT_CONFIRM_ORDER",
      ]);
    } else if (selectedTab === "rejected") {
      setStatusFilter(["REJECT_ORDER"]);
    }
  }, [selectedTab]);

  useEffect(() => {
    console.log("change filter");
    fetchData();
  }, [keyword, statusFilter, dateFilter, page]);

  const resetPage = () => setPage(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, statusCount, count } = await getOrders({
        company,
        search: keyword,
        status: statusFilter,
        page,
        take: pageSize,
        startDate: dateFilter && dateFilter[0] ? dateFilter[0].format("YYYY-MM-DD") : undefined,
        endDate: dateFilter && dateFilter[1] ? dateFilter[1].format("YYYY-MM-DD") : undefined,
        isSpecialRequest: true,
      });
      console.log({ data, statusCount, count });
      setDataState({ data, statusCount, count });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const PageTitle = () => {
    return (
      <Row align='middle' gutter={16}>
        <Col className='gutter-row' span={12}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              อนุมัติคำสั่งซื้อ
            </span>
          </div>
          <div>
            <Text color='Text3'>รายการขอโปรโมชันพิเศษเพิ่มเติม</Text>
          </div>
        </Col>
        <Col span={5}>
          <Input
            placeholder='ค้นหา...'
            suffix={<SearchOutlined />}
            defaultValue={keyword}
            onPressEnter={(e) => {
              const value = (e.target as HTMLTextAreaElement).value;
              setKeyword(value);
              resetPage();
            }}
            onChange={(e) => {
              const value = (e.target as HTMLInputElement).value;
              if (!value) {
                setKeyword("");
                resetPage();
              }
            }}
          />
        </Col>
        <Col span={7}>
          <RangePicker
            allowEmpty={[true, true]}
            enablePast
            value={dateFilter}
            onChange={(dates, dateString) => {
              setDateFilter(dates);
            }}
          />
        </Col>
      </Row>
    );
  };

  const columns = [
    {
      title: "หมายเลขออเดอร์",
      dataIndex: "orderNo",
      key: "orderNo",
      width: "15%",
    },
    {
      title: "ร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      width: "25%",
      render: (value: any, row: any, index: number) => {
        return (
          <FlexCol>
            <Text level={5}>{value || "-"}</Text>
            <Text level={6} color='Text3'>
              {row.customerNo || "-"}
            </Text>
          </FlexCol>
        );
      },
    },
    {
      title: "ทั้งหมด",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: "15%",
      align: "center" as AlignType,
      render: (value: any, row: any, index: number) => {
        return (
          <FlexRow justify='center'>
            <Text level={5}>{priceFormatter(value || "0", 2, true)}</Text>
          </FlexRow>
        );
      },
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createAt",
      key: "createAt",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return <Text style={{ textAlign: "center" }}>{moment(value).format(SLASH_DMY)}</Text>;
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "15%",
      align: "center" as AlignType,
      render: (value: string) => {
        const { name, color } = getSpecialRequestStatus(value as OrderStatusKey);
        return <Tag color={color}>{name}</Tag>;
      },
    },
    {
      title: "จัดการ",
      dataIndex: "orderId",
      key: "orderId",
      width: "10%",
      render: (orderId: any, row: any, index: number) => {
        return {
          children: row.status ? (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => navigate("/special-request/" + orderId)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ height: 32 }} />
            </>
          ),
        };
      },
    },
  ];

  const tabsItems = [
    {
      label: `ทั้งหมด (${Object.values(dataState?.statusCount).reduce(
        (sum, cur) => sum + cur,
        0,
      )})`,
      key: "all",
    },
    {
      label: `รออนุมัติ (${dataState?.statusCount?.WAIT_APPROVE_ORDER})`,
      key: "pending",
    },
    {
      label: `อนุมัติ (${
        Object.values(dataState?.statusCount).reduce((sum, cur) => sum + cur, 0) -
        dataState?.statusCount?.WAIT_APPROVE_ORDER -
        dataState?.statusCount?.REJECT_ORDER
      })`,
      key: "approved",
    },
    {
      label: `ไม่อนุมัติ (${dataState?.statusCount?.REJECT_ORDER})`,
      key: "rejected",
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
              setSelectedTab(key as tabKey);
              resetPage();
            }}
            defaultValue={"all"}
          />
          <Table
            className='rounded-lg'
            columns={columns}
            dataSource={dataState.data.map((e: OrderEntity, i: number) => ({ ...e, key: i }))}
            pagination={{
              pageSize,
              current: page,
              total: dataState.count,
              showSizeChanger: false,
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
