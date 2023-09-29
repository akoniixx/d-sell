import { FieldTimeOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Col, Row, Table, Image, Space, Modal, Form, Checkbox, Radio, Divider, Badge } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button/Button";
import { CardContainer } from "../../components/Card/CardContainer";
import { FlexCol } from "../../components/Container/Container";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Text from "../../components/Text/Text";
import { color } from "../../resource";
import image from "../../resource/image";
import { dateFormatter } from "../../utility/Formatter";
import DatePicker, { TimePicker } from "../../components/DatePicker/DatePicker";
import TextArea from "antd/lib/input/TextArea";
import { getActivePromotion } from "../../datasource/PromotionDatasource";
import {
  createPromotionNoti,
  getPromotionNotiList,
} from "../../datasource/PromotionNotiDatasource";
import { PromotionNotiList, SelectPromotionList } from "../../entities/PromotionNotiEntity";
import {
  mapPromotionNotiStatus,
  mapPromotionNotiStatusColor,
  PromotionNotiStatus,
} from "../../definitions/promotionNotiStatus";

export const PromotionNotification: React.FC = () => {
  const [form] = Form.useForm();
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;
  const take = 10;

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dataPromotion, setDataPromotion] = useState<PromotionNotiList>();
  const [promotionList, setPromotionList] = useState<SelectPromotionList[]>();
  const [searchShop, setSearchShop] = useState<any>();
  const [searchSale, setSearchSale] = useState<any>();
  const [isDisable, setIsDisable] = useState<boolean>(true);

  const appList = [
    { key: "all", value: "all", label: "ทั้งหมด" },
    { key: "sale", value: "sale", label: "Sale App" },
    { key: "shop", value: "shop", label: "Shop App" },
  ];

  const getPromotion = async () => {
    await getPromotionNotiList({
      page,
      take,
      company,
      search,
      status,
      isShowShopApp: searchShop,
      isShowSaleApp: searchSale,
    }).then((res) => {
      console.log("res", res);
      setDataPromotion(res);
    });
  };
  const getPromotionSelect = async () => {
    await getActivePromotion(company, true).then((res) => {
      setPromotionList(res.data);
    });
  };

  useEffect(() => {
    getPromotion();
    getPromotionSelect();
  }, [page, search, status, searchShop, searchSale]);

  const searchApp = (value: string) => {
    if (value === "all") {
      setSearchShop(true);
      setSearchSale(true);
    } else if (value === "sale") {
      setSearchSale(true);
      setSearchShop(false);
    } else if (value === "shop") {
      setSearchSale(false);
      setSearchShop(true);
    } else {
      setSearchShop(undefined);
      setSearchSale(undefined);
    }
  };
  const selectedPromotion = (e: any) => {
    setIsDisable(false);
    const find = promotionList?.find((x) => x.promotionId === e);
    form.setFieldsValue({
      promotionNotiId: "",
      promotionId: find?.promotionId,
      promotionName: find?.promotionName,
      promotionNotiSubject: find?.promotionNotiSubject,
      promotionNotiDetail: find?.promotionNotiDetail,
      isShowSaleApp: find?.isShowSaleApp,
      isShowShopApp: find?.isShowShopApp,
      startDate: dayjs(find?.startDate),
      startTime: dayjs(find?.startDate),
    });
  };
  const editNotiPromotion = async (id: string) => {
    setIsDisable(false);
    setShowModal(!showModal);
    const find = await dataPromotion?.data?.find((x) => x.promotionNotiId === id);
    await form.setFieldsValue({
      promotionNotiId: find?.promotionNotiId,
      promotionId: find?.promotionId,
      promotionName: find?.promotionName,
      promotionNotiSubject: find?.promotionNotiSubject,
      promotionNotiDetail: find?.promotionNotiDetail,
      isShowSaleApp: find?.isShowSaleApp,
      isShowShopApp: find?.isShowShopApp,
      startDate: dayjs(find?.startDate),
      startTime: dayjs(find?.startDate),
      sendType: find?.isSendNow,
      notiDate: dayjs(find?.executeTime),
      notiTime: dayjs(find?.executeTime),
    });
  };

  const closeModal = () => {
    form.resetFields();
    setShowModal(!showModal);
  };

  const PageTitle = (
    <Row align='middle' gutter={16}>
      <Col span={6}>
        <Text level={3} fontWeight={700}>
          แจ้งเตือนโปรโมชัน
        </Text>
      </Col>
      <Col span={6}>
        <Input
          placeholder='ค้นหาชื่อโปรโมชัน'
          suffix={<SearchOutlined style={{ color: "grey" }} />}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Col>
      <Col span={3}>
        <Select
          allowClear
          placeholder='เลือกสถานะ'
          data={PromotionNotiStatus}
          style={{ width: "100%" }}
          onChange={(e) => setStatus(e)}
        />
      </Col>
      <Col span={5}>
        <Select
          allowClear
          placeholder='เลือกแอปพลิเคชัน'
          data={appList}
          style={{ width: "100%" }}
          onChange={(e) => searchApp(e)}
        />
      </Col>
      <Col>
        <Button
          type='primary'
          title='+ เพิ่มการแจ้งเตือน'
          height={40}
          onClick={() => setShowModal(!showModal)}
        />
      </Col>
    </Row>
  );
  const columns: any = [
    {
      title: "วันที่แจ้งแตือน",
      dataIndex: "executeTime",
      key: "executeTime",
      width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{dateFormatter(value, true)}</Text>
              {row.isFromPromotionMaster && (
                <Text color='Text3' level={6}>
                  สร้างจากโปรโมชัน
                </Text>
              )}
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "ชื่อโปรโมชัน/พาดหัว",
      dataIndex: "promotionName",
      key: "promotionName",
      width: "40%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{value || "-"}</Text>
              <Text level={6} color='Text3'>
                {row.promotionNotiSubject}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "แอปพลิเคชัน",
      dataIndex: "application",
      key: "application",
      width: "15%",
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
      title: "อ่านแล้ว",
      dataIndex: "reader",
      key: "reader",
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
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Row gutter={8}>
                <Col>
                  <Badge status={mapPromotionNotiStatusColor[value]} />
                </Col>
                <Text level={5}>{mapPromotionNotiStatus[value] || "-"}</Text>
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
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Row>
                <div className='d-flex flex-row justify-content-between'>
                  <div className='btn btn-icon btn-light btn-hover-primary btn-sm'>
                    <span className='svg-icon svg-icon-primary svg-icon-2x'>
                      <UnorderedListOutlined
                        style={{ color: color["primary"] }}
                        onClick={() => editNotiPromotion(row.promotionNotiId)}
                      />
                    </span>
                  </div>
                </div>
              </Row>
            </>
          ),
        };
      },
    },
  ];

  const createNoti = async () => {
    await form.validateFields();
    const payload = form.getFieldsValue(true);
    //console.log(payload);
    form.setFieldsValue({
      isSendNow: payload.sendType,
      executeTime:
        payload.notiDate && payload.notiTime
          ? dayjs(
              `${payload.notiDate.format("YYYY-MM-DD")} ${payload.notiTime.format("HH:mm")}:00.000`,
            ).toISOString()
          : undefined,
      company: company,
      createBy: `${userProfile.firstname} ${userProfile.lastname}`,
      updateBy: `${userProfile.firstname} ${userProfile.lastname}`,
    });
    const submit = form.getFieldsValue(true);
    console.log(submit);
    if (submit?.promotionNotiId) {
      console.log(1);
      closeModal();
    } else {
      await createPromotionNoti(submit).then((res) => {
        console.log(res);
        if (res.success) {
          closeModal();
        }
      });
    }
  };

  return (
    <>
      <CardContainer>
        {PageTitle}
        <br />
        <Table
          className='rounded-lg'
          columns={columns}
          scroll={{ x: "max-content" }}
          dataSource={dataPromotion?.data}
          size='large'
          tableLayout='fixed'
          pagination={{
            position: ["bottomCenter"],
            pageSize: take,
            current: page,
            total: dataPromotion?.count,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
          }}
        />
      </CardContainer>
      {showModal && (
        <Modal
          open={showModal}
          onCancel={() => closeModal()}
          footer={false}
          width={700}
          title={
            <Text level={4} fontWeight={700}>
              {form.getFieldValue("promotionNotiId") ? "แก้ไขการแจ้งเตือน" : "เพิ่มการแจ้งเตือน"}
            </Text>
          }
        >
          <Form layout='vertical' form={form}>
            <Col span={24}>
              <Form.Item
                name='promotionId'
                label='โปรโมชันที่เลือก'
                rules={[
                  {
                    required: true,
                    message: "*โปรดเลือกโปรโมชัน",
                  },
                ]}
              >
                <Select
                  placeholder='เลือกโปรโมชัน'
                  data={(promotionList || [{ key: "", value: "", label: "" }])?.map((i: any) => ({
                    key: i.promotionId,
                    value: i.promotionId,
                    label: i.promotionName,
                  }))}
                  onChange={(e) => selectedPromotion(e)}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='promotionNotiSubject'
                label='พาดหัว (สำหรับแสดงในแอปพลิเคชัน)'
                rules={[
                  {
                    required: true,
                    message: "*โปรดระบุหัวแจ้งเตือน",
                  },
                ]}
              >
                <TextArea
                  placeholder='ระบุพาดหัวแจ้งเตือน'
                  maxLength={50}
                  showCount
                  autoSize={{ minRows: 1, maxRows: 1 }}
                  autoComplete='off'
                  disabled={isDisable}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label='วันเริ่มโปรโมชัน' name='startDate'>
                    <DatePicker style={{ width: "100%" }} enablePast disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='เวลาเริ่ม'
                    name='startTime'
                    initialValue={dayjs("00:00", "HH:mm")}
                  >
                    <TimePicker allowClear={false} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Form.Item
                name='promotionNotiDetail'
                label='รายละเอียด (สำหรับแสดงในแอปพลิเคชัน)'
                rules={[
                  {
                    required: true,
                    message: "*โปรดระบุรายละเอียดพาดหัว",
                  },
                ]}
              >
                <TextArea
                  placeholder='ระบุรายละเอียดพาดหัวแจ้งเตือน'
                  maxLength={150}
                  showCount
                  autoComplete='off'
                  rows={3}
                  disabled={isDisable}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Text level={5} fontWeight={700}>
                แอปพลิเคชัน
              </Text>
              <Form.Item name='isShowSaleApp' valuePropName='checked' noStyle>
                <Checkbox disabled>Sale App</Checkbox>
              </Form.Item>
              <Form.Item name='isShowShopApp' valuePropName='checked' noStyle>
                <Checkbox disabled>Shop App</Checkbox>
              </Form.Item>
            </Col>
            <br />
            <Col span={24}>
              <Text level={5} fontWeight={700}>
                <span style={{ color: color.error }}>*</span> ประเภทการแจ้งเตือน
              </Text>
              <Form.Item
                name='sendType'
                rules={[
                  {
                    required: true,
                    message: "*โปรดเลือกประเภท",
                  },
                ]}
              >
                <Radio.Group style={{ width: "100%" }}>
                  <Space direction='vertical' style={{ width: "100%" }}>
                    <Radio disabled={isDisable} value={true}>
                      ส่งทันที
                    </Radio>
                    <Radio disabled={isDisable} value={false}>
                      ตั้งเวลาแจ้งเตือน
                    </Radio>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, current) => {
                        return prev.sendType !== current.sendType;
                      }}
                    >
                      {({ getFieldValue }) => {
                        return (
                          getFieldValue("sendType") === false && (
                            <Row gutter={8}>
                              <Col span={12}>
                                <Form.Item
                                  noStyle
                                  name='notiDate'
                                  rules={[
                                    {
                                      required: true,
                                      message: "*โปรดเลือกวันที่แจ้งเตือน",
                                    },
                                  ]}
                                >
                                  <DatePicker
                                    style={{ width: "100%" }}
                                    enablePast
                                    disabledDate={(current: Dayjs) => {
                                      const startDate = getFieldValue("startDate");
                                      return current && current.isBefore(dayjs(startDate));
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  noStyle
                                  name='notiTime'
                                  initialValue={dayjs("07:00", "HH:mm")}
                                >
                                  <TimePicker allowClear={false} />
                                </Form.Item>
                              </Col>
                            </Row>
                          )
                        );
                      }}
                    </Form.Item>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Divider />
            <Row justify='space-between' gutter={12}>
              <Col xl={3} sm={6}></Col>
              <Col xl={18} sm={12}></Col>
              <Col xl={3} sm={6}>
                <Button typeButton='primary' title='บันทึก' onClick={() => createNoti()} />
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </>
  );
};
