import React, { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { Table, Tabs, Row, Col, Avatar, Switch, Modal, message, Tooltip } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import {
  UnorderedListOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { dateFormatter } from "../../utility/Formatter";
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
import image from "../../resource/image";
import promotionState from "../../store/promotion";

type FixedType = "left" | "right" | boolean;
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

  const ActionBtn = ({ onClick, icon }: any) => {
    return (
      <Col span={6}>
        <div className='btn btn-icon btn-light btn-hover-primary btn-sm' onClick={onClick}>
          <span
            className='svg-icon svg-icon-primary svg-icon-2x'
            style={{ color: color["primary"] }}
          >
            {icon}
          </span>
        </div>
      </Col>
    );
  };

  const columns = [
    {
      title: "ชื่อโปรโมชัน",
      dataIndex: "promotionName",
      key: "promotionName",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexRow align='center'>
              <div style={{ marginRight: 16 }}>
                <Avatar
                  src={row.promotionImageSecond || image.emptyPromotion}
                  size={60}
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
    // {
    //   title: "เลขที่อ้างอิง",
    //   dataIndex: "referencePromotion",
    //   key: "referencePromotion",
    //   render: (value: string[], row: any, index: number) => {
    //     const val = value?.join(",");
    //     return {
    //       children: (
    //         <FlexCol>
    //           <Tooltip title={val}>
    //             {val ? (
    //               <Text level={5} key={val}>
    //                 {val.length >= 10 ? val.slice(0, 15) + "..." : val}
    //               </Text>
    //             ) : (
    //               "-"
    //             )}
    //           </Tooltip>
    //         </FlexCol>
    //       ),
    //     };
    //   },
    // },
    {
      title: "ระยะเวลา",
      dataIndex: "startDate",
      key: "startDate",
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
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              {!moment(row.endDate).isBefore(moment()) ? (
                <Switch
                  checked={value}
                  onChange={async (checked: boolean) => {
                    await updatePromotionStatus({
                      promotionId: row.promotionId,
                      isDraft: row.isDraft,
                      promotionStatus: checked,
                      updateBy: firstname + " " + lastname,
                    })
                      .then((res) => {
                        fetchProduct();
                        message.success("แก้ไขสถานะโปรโมชั่นสำเร็จ");
                      })
                      .catch(() => message.error("แก้ไขสถานะโปรโมชั่นไม่สำเร็จ"));
                  }}
                  disabled={moment(row.endDate).isBefore(moment()) || row.promotionStatus}
                />
              ) : (
                <Text level={6} color='Text3'>
                  หมดอายุ
                </Text>
              )}
            </>
          ),
        };
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
        const isExpired = moment(row.endDate).isBefore(moment());
        return {
          children: (
            <>
              <Row>
                <ActionBtn
                  onClick={() => navigate("/PromotionPage/promotion/detail/" + row.promotionId)}
                  icon={<UnorderedListOutlined />}
                />
                {!isExpired && (
                  <ActionBtn
                    onClick={() => navigate("/PromotionPage/promotion/edit/" + row.promotionId)}
                    icon={<EditOutlined />}
                  />
                )}
                <ActionBtn
                  onClick={() => {
                    const query = new URLSearchParams({ copy_id: row.promotionId }).toString();
                    Modal.confirm({
                      title: "ต้องการคัดลอกโปรโมชันนี้ใช่หรือไม่",
                      content: `โปรดตรวจสอบรายละเอียดโปรโมชัน “${row.promotionName}” (${row.promotionCode}) ที่ต้องการคัดลอก ก่อนกดยืนยัน`,
                      okText: "ยืนยัน",
                      onOk: () => navigate("/PromotionPage/promotion/create/?" + query),
                    });
                  }}
                  icon={<CopyOutlined />}
                />
                {!isExpired && (
                  <ActionBtn
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
                              navigate(0);
                            })
                            .catch(() => message.error("ลบโปรโมชั่นไม่สำเร็จ"));
                        },
                      })
                    }
                    icon={<DeleteOutlined style={{ color: color.error }} />}
                  />
                )}
              </Row>
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
              showSizeChanger:false
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
