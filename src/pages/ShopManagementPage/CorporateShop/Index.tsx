import { PlusOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Table, Tag, Form } from "antd";
import React, { useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import SearchInput from "../../../components/Input/SearchInput";
import PageTitle from "../../../components/PageTitle/PageTitle";
import Select from "../../../components/Select/Select";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/Input/Input";
import styled from "styled-components";
import { checkTaxNo, getCusCorporate } from "../../../datasource/CustomerDatasource";
import { zoneDatasource } from "../../../datasource/ZoneDatasource";

const Header = styled(Col)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 20px;
  //display: flex;
  //gap: 16px;
  align-items: center;
  width: "100%";
`;

function IndexCorporateShop(): JSX.Element {
  const navigate = useNavigate();
  const company = JSON.parse(localStorage.getItem("company")!);
  const [form] = Form.useForm();
  const [dataState, setDataState] = useState<{ count: number; data: any[] }>({
    count: 0,
    data: [],
  });
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [searchZone, setSearchZone] = useState<string>("");
  const [cusComId, setCusComId] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkTaxId, setCheckTaxId] = useState<boolean>(false);
  const [cusId, setCusId] = useState<string>("");

  const [zone, setZone] = useState<any>([]);

  const getCusList = async () => {
    await getCusCorporate({
      page: page,
      take: pageSize,
      companyCode: `${company.companyCode}`,
      search,
      sortField: "updateDate",
      sortDirection: "DESC",
      zone: searchZone,
    }).then((res) => {
      setDataState({ count: res.count_total || 0, data: res.data });
    });
  };
  const getZone = async () => {
    await zoneDatasource.getAllZoneByCompany(company?.companyCode).then((res) => {
      setZone(res);
    });
  };

  useEffect(() => {
    getCusList();
    getZone();
  }, [search, page, searchZone]);

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

  const columns: any = [
    {
      title: "รหัสร้านค้า",
      dataIndex: "customerNo",
      key: "customerNo",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text>{value}</Text>,
        };
      },
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Text>{value}</Text>
              <br />
              <Text level={6} color='Text3'>
                {row?.customer?.taxNo}
              </Text>
            </>
          ),
        };
      },
    },
    {
      title: "ชื่อเจ้าของร้าน",
      dataIndex: "userName",
      key: "userName",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Text>
              {row.customer.ownerFirstname || "-"} {row.customer.ownerLastname}
            </Text>
          ),
        };
      },
    },
    {
      title: "เบอร์โทร",
      dataIndex: "telephone",
      key: "telephone",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text>{row.customer.telephone}</Text>,
        };
      },
    },
    {
      title: "จังหวัด",
      dataIndex: "province",
      key: "province",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text>{row.customer.province}</Text>,
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <Tag color={value ? color.success : color.error}>
                {value ? "เปิดใช้งาน" : "ปิดใช้งาน"}
              </Tag>
              <br />
              <Text level={6} color='Text3'>
                ● {row?.zone}
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
            <Row justify={"center"} gutter={16}>
              <ActionBtn
                onClick={() =>
                  navigate(`/ShopManagementPage/detailCorporateShop/${row.customerCompanyId}`)
                }
                icon={<UnorderedListOutlined />}
              />
            </Row>
          ),
        };
      },
    },
  ];

  const checkTax = async (e: string) => {
    const payload = await checkTaxNo(e).then((res) => {
      setCusId(res.responseData ? res.responseData.customerId : "0");
      const isCreate = res?.responseData?.customerCompany?.find(
        (c) => c.company === company.companyCode,
      );
      setCusComId(isCreate && isCreate.customerCompanyId);
      return isCreate ? true : false;
    });
    return payload;
  };

  return (
    <>
      <CardContainer>
        <PageTitle
          title='รายชื่อร้านค้า'
          extra={
            <Row justify={"space-between"} gutter={16}>
              <Col>
                <SearchInput
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder='ค้นหาร้านค้า, รายชื่อ...'
                />
              </Col>
              <Col>
                <Select
                  allowClear
                  placeholder='เขตทั้งหมด'
                  data={
                    zone.map((z) => ({
                      label: z.zoneName,
                      key: z.zoneId,
                      value: z.zoneName,
                    })) || []
                  }
                  style={{
                    width: 180,
                    fontFamily: "Sarabun",
                  }}
                  onChange={(e) => {
                    setSearchZone(e);
                    setPage(1);
                  }}
                />
              </Col>
              {/* <Col>
                <Select
                  allowClear
                  placeholder='สถานะทั้งหมด'
                  data={
                    [
                      //
                    ]
                  }
                  style={{
                    width: 180,
                    fontFamily: "Sarabun",
                  }}
                  onChange={(e) => {
                    setSearchZone(e);
                    setPage(1);
                  }}
                />
              </Col> */}
              <Col>
                <Button
                  onClick={() => setShowModal(!showModal)}
                  title='เพิ่มร้านค้า'
                  typeButton='primary'
                  icon={<PlusOutlined style={{ color: color.white }} />}
                />
              </Col>
            </Row>
          }
        />
        <br />
        <Table
          scroll={{
            x: "max-content",
          }}
          dataSource={dataState.data || []}
          columns={columns || []}
          pagination={{
            position: ["bottomCenter"],
            current: page,
            total: dataState?.count || 0,
            pageSize: pageSize,
            onChange: (page) => {
              setPage(page);
            },
          }}
        />
      </CardContainer>
      {showModal && (
        <Modal
          open={showModal}
          closable={false}
          title={
            <Text fontWeight={600} fontSize={20}>
              เพิ่มร้านค้า
            </Text>
          }
          centered
          onCancel={() => {
            form.setFieldValue("taxNo", "");
            setShowModal(false);
          }}
          destroyOnClose
          cancelText={"ยกเลิก"}
          okText={"ยืนยัน"}
          okButtonProps={{
            style: {
              color: color.white,
              borderColor: checkTaxId ? color.primary : color.Disable,
              backgroundColor: checkTaxId ? color.primary : color.Disable,
            },
          }}
          onOk={() =>
            cusComId
              ? navigate(`/ShopManagementPage/createCorporateShop/${cusComId}/edit`)
              : navigate(`/ShopManagementPage/createCorporateShop/create/${cusId}`)
          }
          cancelButtonProps={{
            style: { color: color.primary, borderColor: color.primary },
          }}
        >
          <Form form={form}>
            <Text fontWeight={600}>หมายเลขประจำตัวผู้เสียภาษี (ร้านค้า)</Text>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='taxNo'
                  style={{
                    width: "100%",
                    marginBottom: 0,
                  }}
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกเลขประจำตัวผู้เสียภาษี",
                    },
                    {
                      pattern: /^[0-9]{13}$/,
                      message: "กรุณากรอกเลขประจำตัวผู้เสียภาษีให้ถูกต้อง",
                    },
                    {
                      async validator(_, value) {
                        if (value.length === 13) {
                          const tax = await checkTax(value);
                          setCheckTaxId(true);
                          return tax
                            ? Promise.reject(
                                "หมายเลขร้านค้าที่ระบุมีข้อมูลอยู่แล้วในระบบ กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง",
                              )
                            : Promise.resolve();
                        } else {
                          setCheckTaxId(false);
                          return Promise.reject();
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    prefix={<SearchOutlined style={{ color: color.Disable }} />}
                    placeholder='ระบุหมายเลขประจำตัวผู้เสียภาษี'
                    autoComplete='off'
                    maxLength={13}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </>
  );
}
export default IndexCorporateShop;
