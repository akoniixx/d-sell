import React, { useEffect, useState } from "react";
import { Table, Tabs, Row, Col, Badge, Modal, message } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import color from "../../resource/color";
import image from "../../resource/image";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import Permission, { checkPermission } from "../../components/Permission/Permission";
import { useRecoilValue } from "recoil";
import { roleAtom } from "../../store/RoleAtom";
import moment from "moment";
import { NewsStatus, newsStatus } from "../../definitions/news";
import { deleteNews, getNewsList } from "../../datasource/News";

type FixedType = "left" | "right" | boolean;

const appList = [
  {
    key: "SHOP",
    name: "Shop App",
    icon: <img src={image.iconShopApp} width='20px' height='20px' />,
  },
  {
    key: "SALE",
    name: "Sale App",
    icon: <img src={image.iconSaleApp} width='20px' height='20px' />,
  },
];

export const NewsList: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };

  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const roleData = useRecoilValue(roleAtom);

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState<string>();
  const [app, setApp] = useState<string>();
  const [statusTab, setStatusTab] = useState<string>("PUBLISHED");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState<{ count: number; count_status: any; data: any[] }>({
    count: 0,
    count_status: {},
    data: [],
  });

  useEffect(() => {
    if (!loading) fetchData();
  }, [keyword, app, statusTab, page]);

  const resetPage = () => setPage(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { responseData } = await getNewsList({
        company,
        take: pageSize,
        searchText: keyword,
        status: statusTab,
        application: app,
        page,
      });
      const { data, count, count_status } = responseData;
      setDataState({
        data,
        count,
        count_status: {
          PUBLISHED: count_status?.find((e: any) => e?.status === "PUBLISHED")?.count || 0,
          WAITING: count_status?.find((e: any) => e?.status === "WAITING")?.count || 0,
          DRAFT: count_status?.find((e: any) => e?.status === "DRAFT")?.count || 0,
          INACTIVE: count_status?.find((e: any) => e?.status === "INACTIVE")?.count || 0,
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const PageTitle = () => {
    return (
      <>
        <Row gutter={16}>
          <Col className='gutter-row' span={12}>
            <div>
              <span
                className='card-label font-weight-bolder text-dark'
                style={{ fontSize: 20, fontWeight: "bold" }}
              >
                รายการข่าวสาร
              </span>
            </div>
          </Col>
          <Col span={4}>
            <Input
              placeholder='ค้นหาชื่อข่าวสาร'
              prefix={<SearchOutlined style={{ color: "grey" }} />}
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
          <Col span={4}>
            <Select
              allowClear
              onChange={(value: string) => {
                setApp(value);
                resetPage();
              }}
              placeholder='เลือกแอปพลิเคชัน'
              data={appList.map(({ key, name, icon }) => ({
                key,
                label: (
                  <span>
                    {icon}&nbsp;{name}
                  </span>
                ),
                value: key,
              }))}
              style={{ width: "100%" }}
              value={app}
            />
          </Col>
          <Permission permission={["newsList", "create"]}>
            <Col className='gutter-row' span={4}>
              <Button
                title='เพิ่มข่าวสาร'
                icon={<PlusOutlined />}
                onClick={() => navigate(`/news/create`)}
              />
            </Col>
          </Permission>
        </Row>
      </>
    );
  };

  const tabsItems = [
    { label: `เผยแพร่แล้ว (${dataState.count_status.PUBLISHED || 0})`, key: "PUBLISHED" },
    {
      label: `รอเวลาเผยแพร่ (${dataState.count_status.WAITING || 0})`,
      key: "WAITING",
    },
    { label: `แบบร่าง (${dataState.count_status.DRAFT || 0})`, key: "DRAFT" },
    { label: `ปิดการใช้งาน (${dataState.count_status.INACTIVE || 0})`, key: "INACTIVE" },
  ];

  const columns = [
    {
      title: "วันที่เผยแพร่",
      dataIndex: "updatedAt",
      key: "date",
      // width: "12%",
      render: (value: any, row: any, index: number) => {
        return (
          <FlexCol>
            <Text level={5}>
              {row.status === "DRAFT" ? "-" : moment(row.publishTime).format("DD/MM/YYYY, HH:mm")}
            </Text>
            {row.status === "WAITING" ? (
              <Text level={5} color='warning'>
                <ClockCircleOutlined />
                &nbsp;ตั้งเวลา
              </Text>
            ) : (
              <></>
            )}
          </FlexCol>
        );
      },
    },
    {
      title: "ชื่อข่าวสาร",
      dataIndex: "topic",
      key: "topic",
      // width: "18%",
      render: (topic: any, row: any, index: number) => {
        return {
          children: (
            <FlexRow>
              <img
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 4,
                  objectFit: "fill",
                  marginRight: 8,
                }}
                src={row.imageUrl}
              />
              <Text level={5}>{topic}</Text>
            </FlexRow>
          ),
        };
      },
    },
    {
      title: "อ่านแล้ว",
      dataIndex: "productCategoryId",
      key: "productCategoryId",
      width: "124px",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>0</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "แอปพลิเคชัน",
      dataIndex: "isShowOnSaleApp",
      key: "isShowOnSaleApp",
      width: "132px",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              {row.isShowOnShopApp && (
                <Text level={5}>
                  <img width={20} height={20} src={image.iconShopApp} />
                  &nbsp;&nbsp;{"Shop App"}
                </Text>
              )}
              {row.isShowOnSaleApp && (
                <Text level={5}>
                  <img width={20} height={20} src={image.iconSaleApp} />
                  &nbsp;&nbsp;{"Sale App"}
                </Text>
              )}
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      fixed: "right" as FixedType | undefined,
      render: (value: NewsStatus, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>
                <Badge color={newsStatus[value].color} />
                &nbsp;&nbsp;
                {newsStatus[value].nickname}
              </Text>
              <Text level={6} color='Text3'>
                {row.updatedBy}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "จัดการ",
      dataIndex: "newsId",
      key: "action",
      fixed: "right" as FixedType | undefined,
      width: 108,
      hidden:
        !checkPermission(["newsList", "edit"], roleData) &&
        !checkPermission(["newsList", "delete"], roleData),
      render: (newsId: any, row: any, index: number) => {
        const onClickDelete = () => {
          Modal.confirm({
            icon: <></>,
            title: <Text level={2}>ต้องการยืนยันการลบข่าวสาร</Text>,
            content: (
              <Text level={5} color='Text3'>
                โปรดตรวจสอบข่าวสารที่คุณต้องการลบ ก่อนกดยืนยัน
                เพราะอาจส่งผลต่อการทำงานของผู้ดูแลระบบ
              </Text>
            ),
            width: 524,
            cancelText: "ยกเลิก",
            okText: "ยืนยัน",
            onOk: async () => {
              try {
                await deleteNews({ newsId, updateBy: firstname + " " + lastname }).then(() => {
                  message.success("ลบข่าวสารสำเร็จ");
                  // location.reload();
                  fetchData();
                });
              } catch (err) {
                console.log(err);
                message.error("ลบข่าวสารไม่สำเร็จ");
              }
            },
          });
        };
        return {
          children: (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <Permission permission={["newsList", "edit"]}>
                  <div
                    className='btn btn-icon btn-light btn-hover-primary btn-sm'
                    onClick={() => navigate("/news/edit/" + row.newsId)}
                  >
                    <span className='svg-icon svg-icon-primary svg-icon-2x'>
                      <EditOutlined style={{ color: color["primary"] }} />
                    </span>
                  </div>
                </Permission>
                <Permission permission={["newsList", "delete"]}>
                  <div className='btn btn-icon btn-light btn-hover-primary btn-sm'>
                    <span className='svg-icon svg-icon-primary svg-icon-2x'>
                      <DeleteOutlined style={{ color: color.error }} onClick={onClickDelete} />
                    </span>
                  </div>
                </Permission>
              </div>
            </>
          ),
        };
      },
    },
  ].filter((item) => !item.hidden);

  const changeTeb = (key: string) => {
    setStatusTab(`${key}`);
    resetPage();
  };

  return (
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <br />
          <Tabs items={tabsItems} onChange={changeTeb} />
          <Table
            className='rounded-lg'
            columns={
              company === "ICPL" ? columns : columns.filter((x) => x.dataIndex !== "unitPrice")
            }
            scroll={{ x: "max-content" }}
            dataSource={dataState?.data
              ?.map((d: any, i) => ({ ...d, key: i }))
              .filter((d: any) => d.status === statusTab)}
            pagination={{
              position: ["bottomCenter"],
              pageSize,
              current: page,
              total: dataState?.count,
              onChange: (p) => setPage(p),
              showSizeChanger: false,
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
