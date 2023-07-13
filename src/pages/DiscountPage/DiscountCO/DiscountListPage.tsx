import React, { useEffect, useState } from "react";
import { Table, Tabs, Modal, Switch, Row, Col, message } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { RangePicker } from "../../../components/DatePicker/DatePicker";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import {
  deleteCreditMemo,
  getCreditMemoList,
  syncNavision,
  updateCreditMemoStatus,
} from "../../../datasource/CreditMemoDatasource";
import { dateFormatter } from "../../../utility/Formatter";
import { FlexCol } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import color from "../../../resource/color";

const SLASH_DMY = "DD/MM/YYYY";
const REQUEST_DMY = "YYYY-MM-DD";
type FixedType = "left" | "right" | boolean;

export const DiscountListPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };
  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const [loadingSyncProduct, setLoadingSyncProduct] = useState(false);

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
    if (!loading) fetchData();
  }, [keyword, statusFilter, dateFilter, page]);

  const resetPage = () => setPage(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, count, count_status } = await getCreditMemoList({
        company,
        creditMemoStatus: statusFilter,
        startDate: dateFilter && dateFilter[0] ? dateFilter[0].format(REQUEST_DMY) : undefined,
        endDate: dateFilter && dateFilter[1] ? dateFilter[1].format(REQUEST_DMY) : undefined,
        searchText: keyword,
        take: pageSize,
        page,
      });
      setDataState({
        data: data?.map((e: any, i: number) => ({ ...e, key: i })),
        count,
        count_status,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onChangeStatus = async (creditMemoId: string, status: boolean) => {
    const { success, userMessage } = await updateCreditMemoStatus({
      creditMemoId,
      creditMemoStatus: status,
      updateBy: `${firstname} ${lastname}`,
    });
    if (success) {
      message.success(userMessage);
      fetchData();
    } else {
      message.error(userMessage);
    }
  };

  const onSyncProduct = async () => {
    Modal.confirm({
      title: "ยืนยันการเชื่อมต่อ Navision",
      onOk: async () => {
        setLoadingSyncProduct(true);
        await syncNavision(company)
          .then((res: any) => {
            const { success } = res.data;
            if (success) {
              navigate(0);
            } else {
              message.error("เชื่อมต่อ Navision ไม่สำเร็จ");
            }
          })
          .catch((err) => console.log("err", err))
          .finally(() => {
            setLoadingSyncProduct(false);
          });
      },
    });
  };

  const PageTitle = () => {
    return (
      <Row align='middle' gutter={16}>
        <Col className='gutter-row' span={10}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              รายการ เพิ่ม/ลด ส่วนลดดูแลราคา
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <div style={style}>
            <Input
              placeholder='ค้นหา ส่วนลดดูแลราคา'
              prefix={<SearchOutlined style={{ color: "grey" }} />}
              defaultValue={keyword}
              onPressEnter={(e: any) => {
                const value = (e.target as HTMLTextAreaElement).value;
                setKeyword(value);
                resetPage();
              }}
              onChange={(e: any) => {
                const value = (e.target as HTMLInputElement).value;
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
            onChange={(dates: any) => {
              setDateFilter(dates);
              resetPage();
            }}
          />
        </Col>
        {company !== "ICPF" ? (
          <Col className='gutter-row' xl={4} sm={6}>
            <Button
              type='primary'
              title='+ สร้างส่วนลดดูแลราคา'
              height={40}
              onClick={() => navigate(`/discount/create`)}
            />
          </Col>
        ) : (
          <Col className='gutter-row' xl={4} sm={6}>
            <Button
              title='Navision'
              icon={<SyncOutlined />}
              onClick={onSyncProduct}
              loading={loadingSyncProduct}
              height={40}
            />
          </Col>
        )}
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
      title: "ส่วนลดดูแลราคา No.",
      dataIndex: "creditMemoCode",
      key: "creditMemoCode",
      width: "15%",
    },
    {
      title: "ชื่อรายการ ส่วนลดดูแลราคา",
      dataIndex: "creditMemoName",
      key: "creditMemoName",
      width: "20%",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (value: string) => {
        return dateFormatter(value);
      },
    },
    {
      title: "อัปเดทโดย",
      dataIndex: "updateBy",
      key: "updateBy",
      width: "10%",
      render: (value: string, row: any) => {
        return (
          <>
            <FlexCol>
              <Text level={6}>{row.updatedAt ? dateFormatter(row.updatedAt) : "-"}</Text>
              <Text color='Text3' level={6}>
                {value || "-"}
              </Text>
            </FlexCol>
          </>
        );
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Switch
              checked={row.creditMemoStatus}
              onChange={(val) => onChangeStatus(row.creditMemoId, val)}
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
            <Row justify={"start"} gutter={8}>
              <Col span={8}>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => navigate("/discount/detail/" + row.creditMemoId)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
              </Col>
              <Col span={8}>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => navigate("/discount/edit/" + row.creditMemoId)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <EditOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
              </Col>
              {company !== "ICPF" && (
                <Col span={8}>
                  <div
                    className='btn btn-icon btn-light btn-hover-primary btn-sm'
                    onClick={async () => {
                      Modal.confirm({
                        title: "ต้องการลบข้อมูล",
                        content: "โปรดยืนยันการลบข้อมูลรายการ ส่วนลดดูแลราคา",
                        onOk: async () => {
                          await deleteCreditMemo({
                            creditMemoId: row?.creditMemoId,
                            updateBy: `${firstname} ${lastname}`,
                          })
                            .then(({ success, userMessage }: any) => {
                              if (success) {
                                Modal.success({
                                  title: "ลบข้อมูลสำเร็จ",
                                  onOk: () => navigate(0),
                                });
                              } else {
                                Modal.error({
                                  title: "ลบข้อมูลไม่สำเร็จ",
                                  content: userMessage,
                                });
                              }
                            })
                            .catch((e: any) => {
                              console.log(e);
                            });
                        },
                      });
                    }}
                  >
                    <span className='svg-icon svg-icon-primary svg-icon-2x'>
                      <DeleteOutlined style={{ color: color["primary"] }} />
                    </span>
                  </div>
                </Col>
              )}
            </Row>
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
            columns={company === "ICPF" ? columns.filter((x) => x.dataIndex !== "status") : columns}
            dataSource={dataState.data}
            pagination={{
              pageSize,
              total: dataState.count,
              current: page,
              onChange: (page, pageSize) => {
                setPage(page);
              },
              showSizeChanger: false,
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
