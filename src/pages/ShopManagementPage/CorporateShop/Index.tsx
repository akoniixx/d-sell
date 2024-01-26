import {
  PlusOutlined,
  SearchOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Col, Modal, Row, Table } from "antd";
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
import { getCusCorporate } from "../../../datasource/CustomerDatasource";

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

  const [dataState, setDataState] = useState<{ count: number; data: any[] }>({
    count: 0,
    data: [],
  });
  const pageSize = 8;
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isActive, setIsActive] = useState<any>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<any>({});
  const [checkDup, setCheckDup] = useState<boolean>(true);

  const getCusList = async () => {
    await getCusCorporate({
      page: page,
      take: pageSize,
      companyCode: `${company.companyCode}`,
      search,
    }).then((res) => {
      setDataState({ count: res.count_total || 0, data: res.data });
    });
  };

  useEffect(() => {
    getCusList();
  }, [search, page]);

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
          children: <Text>{value}</Text>,
        };
      },
    },
    {
      title: "ชื่อเจ้าของร้าน",
      dataIndex: "userName",
      key: "userName",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Text>{value}</Text>,
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
      dataIndex: "status",
      key: "status",
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
                onClick={() => navigate("/ShopManagementPage/detailCorporateShop/1050")}
                icon={<UnorderedListOutlined />}
              />
            </Row>
          ),
        };
      },
    },
  ];

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
                  placeholder='เขต : ทั้งหมด'
                  data={[]}
                  style={{
                    width: 180,
                    fontFamily: "Sarabun",
                  }}
                />
              </Col>
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
            current: page,
            total: dataState?.count || 0,
            pageSize: 8,
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
            //setCheckDup(true);
            setShowModal(false);
            setDataUser("");
          }}
          destroyOnClose
          cancelText={"ยกเลิก"}
          okText={"ยืนยัน"}
          okButtonProps={{
            style: {
              color: color.white,
              borderColor: color.primary,
              //checkDup && Object.keys(dataUser).length > 0 ? color.primary : color.Disable,
              backgroundColor: color.primary,
              //checkDup && Object.keys(dataUser).length > 0 ? color.primary : color.Disable,
            },
          }}
          onOk={() => navigate("/ShopManagementPage/createCorporateShop/create")}
          cancelButtonProps={{
            style: { color: color.primary, borderColor: color.primary },
          }}
        >
          <Text fontWeight={600}>หมายเลขประจำตัวผู้เสียภาษี (ร้านค้า)</Text>
          <Row>
            <Col span={24}>
              <Input
                prefix={<SearchOutlined style={{ color: color.Disable }} />}
                placeholder='ระบุหมายเลขประจำตัวผู้เสียภาษี'
                onChange={async (e: any) => {
                  if (!e) {
                    setDataUser("");
                    setCheckDup(true);
                  } else {
                    console.log(2);
                  }
                }}
              />
            </Col>
          </Row>
          <br />
          {Object.keys(dataUser).length > 0 && checkDup ? (
            <Header>
              <Row gutter={16}>
                <Col span={2}>
                  <ShopOutlined style={{ fontSize: "20px" }} />
                </Col>
                <Col span={22}>
                  <Text fontSize={16} color='primary' fontWeight={600}>
                    {dataUser.customerName}
                  </Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Text fontSize={14} fontWeight={500}>
                    หมายเลขนิติบุคคล
                  </Text>
                  <br />
                  <Text fontSize={14}>{dataUser.taxId}</Text>
                </Col>
                <Col span={12}>
                  <Text fontSize={14} fontWeight={500}>
                    เบอร์โทรศัพท์
                  </Text>
                  <br />
                  <Text fontSize={14}>{dataUser.telephone}</Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Text fontSize={14} fontWeight={500}>
                    เจ้าของร้าน
                  </Text>
                  <br />
                  <Text fontSize={14}>{dataUser.userName}</Text>
                </Col>
                <Col span={12}>
                  <Text fontSize={14} fontWeight={500}>
                    จังหวัด
                  </Text>
                  <br />
                  <Text fontSize={14}>{dataUser.province}</Text>
                </Col>
              </Row>
            </Header>
          ) : Object.keys(dataUser).length === 0 && !checkDup ? (
            <Text color='error' fontSize={16}>
              ร้านค้าที่เลือกมีข้อมูลแล้วในระบบ กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง
            </Text>
          ) : (
            <></>
          )}
        </Modal>
      )}
    </>
  );
}
export default IndexCorporateShop;