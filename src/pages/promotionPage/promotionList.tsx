import React, { useEffect, useState, memo, useMemo } from "react";
import { Table, Tabs, Row, Col, Select, Avatar, Tag, Switch, Modal, message } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import {
  UnorderedListOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import { dateFormatter, nameFormatter, priceFormatter } from "../../utility/Formatter";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import color from "../../resource/color";
import Button from "../../components/Button/Button";
import moment from "moment";
import Input from "../../components/Input/Input";
import { RangePicker } from "../../components/DatePicker/DatePicker";
import { useNavigate } from "react-router-dom";
import {
  deletePromotion,
  getPromotion,
  updatePromotionStatus,
} from "../../datasource/PromotionDatasource";
import { PROMOTION_TYPE_NAME } from "../../definitions/promotion";
import { Dayjs } from "dayjs";
import image from "../../resource/image";

type FixedType = "left" | "right" | boolean;
const SLASH_DMY = "DD/MM/YYYY";
const REQUEST_DMY = "YYYY-MM-DD";

export const PromotionListPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };

  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string>();
  const [dateFilter, setDateFilter] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState({
    count: 0,
    count_status: [],
    data: [] as any[],
  });

  useEffect(() => {
    if (!loading) fetchProduct();
  }, [keyword, statusFilter, dateFilter, page]);

  const resetPage = () => setPage(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, count, count_status } = await getPromotion({
        company,
        promotionStatus: statusFilter,
        startDate: dateFilter && dateFilter[0] ? dateFilter[0].format(REQUEST_DMY) : undefined,
        endDate: dateFilter && dateFilter[1] ? dateFilter[1].format(REQUEST_DMY) : undefined,
        searchText: keyword,
        take: pageSize,
        page,
      });
      setDataState({
        data,
        count,
        count_status,
      });
      console.log({ data, count, count_status, dateFilter });
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
              รายการโปรโมชั่น
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <div style={style}>
            <Input
              placeholder='ค้นหาโปรโมชั่น'
              prefix={<SearchOutlined style={{ color: "grey" }} />}
              defaultValue={keyword}
              onPressEnter={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                setKeyword(value);
                resetPage();
              }}
              onChange={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                if (!value) {
                  setKeyword("");
                  resetPage();
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
            title='+ สร้างโปรโมชัน'
            height={40}
            onClick={() => (window.location.pathname = "/PromotionPage/promotion/create")}
          />
        </Col>
      </Row>
    );
  };

  const tabsItems = [
    {
      label: `ทั้งหมด (${
        dataState?.count_status?.reduce((acc: number, cur: any) => acc + parseInt(cur.count), 0) ||
        0
      })`,
      key: "ALL",
    },
    {
      label: `Active (${
        (dataState?.count_status?.find((c: any) => c.promotion_status) as any)?.count || 0
      })`,
      key: "true",
    },
    {
      label: `Inactive (${
        (dataState?.count_status?.find((c: any) => !c.promotion_status) as any)?.count || 0
      })`,
      key: "false",
    },
  ];

  const columns = [
    {
      title: "ชื่อโปรโมชัน",
      dataIndex: "promotionName",
      key: "promotionName",
      // width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexRow align='center'>
              <div style={{ marginRight: 16 }}>
                <Avatar
                  src={row.promotionImageSecond || image.product_no_image}
                  size={50}
                  shape='square'
                />
              </div>
              <FlexCol>
                <Text level={5}>{value}</Text>
                <Text level={6} color='Text3'>
                  {row.promotionCode}
                </Text>
              </FlexCol>
            </FlexRow>
          ),
        };
      },
    },
    {
      title: "ประเภทส่วนลด",
      dataIndex: "promotionType",
      key: "promotionType",
      // width: "18%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{PROMOTION_TYPE_NAME[value]}</Text>
              <Text level={6} color='Text3'>
                {row.numOfStore}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "เลขที่อ้างอิง",
      dataIndex: "referencePromotion",
      key: "referencePromotion",
      render: (value: string[], row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              {value && value.length >= 0
                ? value.map((v) => (
                    <Text level={5} key={v}>
                      {v.length >= 10 ? v.slice(0, 9) + "..." : v}
                    </Text>
                  ))
                : "-"}
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "ระยะเวลา",
      dataIndex: "startDate",
      key: "startDate",
      // width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>
                {dateFormatter(row.startDate)} - {dateFormatter(row.endDate)}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "อัปเดทโดย",
      dataIndex: "updateBy",
      key: "updateBy",
      // width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{value || "-"}</Text>
              <Text level={6} color='Text3'>
                {dateFormatter(row.updatedAt)}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "promotionStatus",
      key: "promotionStatus",
      // width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Switch
              checked={value}
              onChange={async (checked: boolean) => {
                console.log("onToggleSwitch", checked);
                await updatePromotionStatus({
                  promotionId: row.promotionId,
                  isDraft: row.isDraft,
                  promotionStatus: checked,
                  updateBy: firstname + " " + lastname,
                })
                  .then((res) => {
                    // console.log(res)
                    fetchProduct();
                    // setDataState({
                    //   ...dataState,
                    //   data: dataState?.data.map((d: object, i) =>
                    //     i !== index
                    //       ? d
                    //       : {
                    //           ...d,
                    //           promotionStatus: checked,
                    //         },
                    //   ),
                    // });
                    message.success("แก้ไขสถานะโปรโมชั่นสำเร็จ");
                  })
                  .catch(() => message.error("แก้ไขสถานะโปรโมชั่นไม่สำเร็จ"));
              }}
              disabled={moment(row.endDate).isBefore(moment())}
            />
          ),
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
                  onClick={() => navigate("/PromotionPage/promotion/edit/" + row.promotionId)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <EditOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() =>
                    Modal.confirm({
                      title: "ยืนยันการลบโปรโมชั่น",
                      okText: "",
                      cancelText: "",
                      onOk: async () => {
                        await deletePromotion({
                          promotionId: row.promotionId,
                          updateBy: firstname + " " + lastname,
                        })
                          .then((res) => {
                            // console.log(res)
                            navigate(0);
                          })
                          .catch(() => message.error("ลบโปรโมชั่นไม่สำเร็จ"));
                      },
                    })
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
      <div className='container'>
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
            scroll={{ x: "max-content" }}
            dataSource={dataState?.data?.map((d: object, i) => ({ ...d, key: i }))}
            pagination={{
              position: ["bottomCenter"],
              pageSize,
              current: page,
              total: dataState?.count,
              onChange: (p) => setPage(p),
            }}
            loading={loading}
            size='large'
            tableLayout='fixed'
          />
        </CardContainer>
      </div>
    </>
  );
};
