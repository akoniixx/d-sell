import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row, Table, Image, Badge, Modal } from "antd";
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

export const HighLightNews: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const take = 10;

  const [page, setPage] = useState<number>(1);
  const [isEdit, setEdit] = useState<boolean>(false);

  const mockData = [
    {
      startDate: new Date(),
      endDate: new Date(),
      img: image.expHighLight,
      name: "ร่วมสนุกรับวันสงกรานต์กับ ไอ ซี พี ลัดดาเพียงถ่ายรูปคู่สินค้าชนิดใดก็ได้ พร้อมคำโดนใจ",
      isShowShopApp: true,
      isShowSaleApp: true,
      status: "DONE",
      updateBy: "รชยา ช่างภักดี",
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
  const PageTitle = (
    <Row align='middle' gutter={16}>
      <Col span={9}>
        <Text level={3} fontWeight={700}>
          ข่าวสารไฮไลท์
        </Text>
      </Col>
      <Col span={6}>
        <Input
          placeholder='ค้นหาชื่อข่าวสาร'
          suffix={<SearchOutlined style={{ color: "grey" }} />}
          //onChange={(e) => setSearch(e.target.value)}
        />
      </Col>
      <Col span={5}>
        <Select
          allowClear
          placeholder='เลือกแอปพลิเคชัน'
          data={[]}
          style={{ width: "100%" }}
          //onChange={(e) => searchApp(e)}
        />
      </Col>
      <Col>
        <Button
          type='primary'
          title='+ เพิ่มข่าวสารไฮไลน์'
          height={40}
          onClick={() => navigate("/news/createhighlight")}
        />
      </Col>
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
      dataIndex: "name",
      key: "name",
      width: "40%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Row justify={"start"} gutter={8}>
              <Col span={4}>
                <Image src={row.img} height={60} width={60} style={{ borderRadius: "5px" }} />
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
              {row.isShowSaleApp && (
                <Col span={24}>
                  <Image src={image.iconSaleApp} height={25} preview={false} />
                  <Text level={5} style={{ paddingLeft: "5px" }}>
                    Sale App
                  </Text>
                </Col>
              )}
              {row.isShowShopApp && (
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
                  10
                </Text>
              </Col>
              <Col span={24}>
                <Text level={5} style={{ paddingLeft: "5px" }}>
                  5
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
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Row gutter={8}>
                <Col>
                  <Badge status='success' />
                </Col>
                <Text level={5}>{"ใช้งาน" || "-"}</Text>
              </Row>
              <Text level={6} color='Text3'>
                {row.updateBy}
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
                  setEdit(false);
                  navigate(`/news/createhighlight`);
                }}
                icon={<EditOutlined />}
              />
              <ActionBtn
                onClick={() =>
                  Modal.confirm({
                    title: "ต้องการยืนยันการลบ",
                    okText: "",
                    cancelText: "",
                    // onOk: async () => {
                    //   await deletePromotionNoti(row.promotionNotiId)
                    //     .then((res) => {
                    //       navigate(0);
                    //     })
                    //     .catch(() => message.error("ลบโปรโมชั่นไม่สำเร็จ"));
                    // },
                  })
                }
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
        dataSource={mockData}
        size='large'
        tableLayout='fixed'
        pagination={{
          position: ["bottomCenter"],
          pageSize: take,
          current: page,
          total: 10,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
      />
    </CardContainer>
  );
};
