import { DeleteOutlined, EditOutlined, LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row, Table, Image, Badge, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { CardContainer } from "../../components/Card/CardContainer";
import { FlexCol } from "../../components/Container/Container";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Text from "../../components/Text/Text";
import { color } from "../../resource";
import image from "../../resource/image";
import { dateFormatter } from "../../utility/Formatter";
import { useEffectOnce } from "react-use";
import Permission from "../../components/Permission/Permission";
import { deleteHighlight, getHighlightList } from "../../datasource/News";

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

export const HighLightNews: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const [app, setApp] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [dataState, setDataState] = useState<{ count: number; data: any[] }>({
    count: 0,
    data: [],
  });
  const [deletingId, setDeletingId] = useState<string>();

  const resetPage = () => setPage(1);

  useEffect(() => {
    if (!loading) fetchData();
  }, [keyword, app, page]);

  useEffectOnce(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { responseData } = await getHighlightList({
        company,
        take: pageSize,
        searchText: keyword,
        application: app,
        page,
      });
      const { data, count } = responseData;
      console.log(responseData);
      setDataState({
        data,
        count,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

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

  const PageTitle = (
    <Row align='middle' gutter={16}>
      <Col span={12}>
        <Text level={3} fontWeight={700}>
          ข่าวสารไฮไลท์
        </Text>
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
            type='primary'
            title='+ เพิ่มข่าวสารไฮไลน์'
            height={40}
            onClick={() => navigate("/news/createhighlight")}
          />
        </Col>
      </Permission>
    </Row>
  );

  const columns: any = [
    {
      title: "วันที่เผยแพร่",
      dataIndex: "date",
      key: "date",
      width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row>
              <Text level={5}>{dateFormatter(row.startDate, true)}</Text> -{" "}
              <Text level={5}>{dateFormatter(row.endDate, true)}</Text>
            </Row>
          ),
        };
      },
    },
    {
      title: "ชื่อข่าวสาร",
      dataIndex: "topic",
      key: "topic",
      width: "40%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
              <Col span={4}>
                <Image
                  src={row.imageUrl}
                  height={60}
                  width={60}
                  style={{ borderRadius: "5px", objectFit: "cover" }}
                />
              </Col>
              <Col span={20}>
                <Text level={5}>{value || "-"}</Text>
              </Col>
            </Row>
          ),
        };
      },
    },
    {
      title: "แอปพลิเคชัน",
      dataIndex: "application",
      key: "application",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row gutter={16} justify={"space-between"}>
              {row.isShowOnSaleApp && (
                <Col span={24}>
                  <Image src={image.iconSaleApp} height={25} preview={false} />
                  <Text level={5} style={{ paddingLeft: "5px" }}>
                    Sale App
                  </Text>
                </Col>
              )}
              {row.isShowOnShopApp && (
                <Col span={24}>
                  <Image src={image.iconShopApp} height={25} preview={false} />
                  <Text level={5} style={{ paddingLeft: "5px" }}>
                    Shop App
                  </Text>
                </Col>
              )}
            </Row>
          ),
        };
      },
    },
    {
      title: "กดลิ้งแล้ว",
      dataIndex: "reader",
      key: "reader",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row gutter={16} justify={"space-between"}>
              <Col span={24}>
                <Text level={5} style={{ paddingLeft: "5px" }}>
                  {row.viewSaleApp}
                </Text>
              </Col>
              <Col span={24}>
                <Text level={5} style={{ paddingLeft: "5px" }}>
                  {row.viewShopApp}
                </Text>
              </Col>
            </Row>
          ),
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Row gutter={8}>
                <Col>
                  <Badge status={status === "true" ? "success" : "default"} />
                </Col>
                <Text level={5}>{status === "true" ? "ใช้งาน" : "ปิดใช้งาน"}</Text>
              </Row>
              <Text level={6} color='Text3'>
                {row.updatedBy}
              </Text>
            </>
          ),
        };
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
              <ActionBtn
                onClick={() => {
                  navigate(`/news/edithighlight/${row.highlightNewsId}`);
                }}
                icon={<EditOutlined />}
              />
              <ActionBtn
                onClick={() => setDeletingId(row.highlightNewsId)}
                icon={<DeleteOutlined style={{ color: color.error }} />}
              />
            </Row>
          ),
        };
      },
    },
  ];

  return (
    <CardContainer>
      {PageTitle}
      <br />
      <Table
        className='rounded-lg'
        columns={columns}
        scroll={{ x: 1300 }}
        dataSource={dataState.data}
        size='large'
        tableLayout='fixed'
        loading={loading}
        pagination={{
          position: ["bottomCenter"],
          pageSize,
          current: page,
          total: dataState.count,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
      />
      <Modal
        open={!!deletingId}
        closable={false}
        onOk={async () => {
          if (deletingId) {
            await deleteHighlight({
              highlightNewsId: deletingId,
              updateBy: firstname + " " + lastname,
            })
              .then((res) => {
                navigate(0);
              })
              .catch(() => message.error("ลบโปรโมชั่นไม่สำเร็จ"));
          }
        }}
        onCancel={() => setDeletingId(undefined)}
        destroyOnClose
        okText={"ยืนยัน"}
        cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
      >
        <Text level={2}>ต้องการยืนยันการลบ</Text>
        <br />
        <Text level={5} color='Text3'>
          โปรดตรวจสอบข่าวสารที่คุณต้องการลบ ก่อนกดยืนยัน
          <br />
          เพราะอาจส่งผลต่อการทำงานของผู้ดูแลระบบ
        </Text>
      </Modal>
    </CardContainer>
  );
};
