import React, { useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import { FormOutlined } from "@ant-design/icons";
import AntdTabs from "../../../components/AntdTabs/AntdTabs";
import { useNavigate } from "react-router-dom";
import { Avatar, Col, Row, Table } from "antd";
import styled from "styled-components";
import { color } from "../../../resource";
import TableContainer from "../../../components/Table/TableContainer";
import { getCustomersById } from "../../../datasource/CustomerDatasource";
import image from "../../../resource/image";
import dayjs from "dayjs";

const Header = styled(Row)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
`;
const Image = styled.img`
  height: 52px;
  padding: 16px 8px;
  background-color: white;
  border-radius: 8px;
`;

function DetailCorporateShop(): JSX.Element {
  const navigate = useNavigate();
  const company = JSON.parse(localStorage.getItem("company")!);
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const id = pathSplit[3];

  const [detail, setDetail] = useState<any>();

  const getCusComById = async () => {
    await getCustomersById(id).then((res) => {
      console.log("detail", res);
      setDetail(res);
    });
  };

  useEffect(() => {
    getCusComById();
  }, []);

  const DetailTab = () => {
    return (
      <>
        <Header>
          <Image src={image.empty_shop || ""} width={40} height={40} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <Text level={6} fontWeight={700}>
              {detail?.customerName}
            </Text>
            <Row justify={"space-between"} gutter={8}>
              <Col>
                <Text level={6}>
                  ประเภทคู่ค้า :{" "}
                  <Text color='primary' level={6}>
                    {detail?.customerType === "DL" ? "Dealer" : "Subdealer"}
                  </Text>
                </Text>
              </Col>
              <Col>
                <Text level={6}>รหัสร้านค้า : {detail?.customerNo || "-"}</Text>
              </Col>
              <Col>
                <Text level={6}>เขต : {detail?.zone || "-"}</Text>
              </Col>
            </Row>
          </div>
        </Header>
        <br />
        <Col>
          <Text fontWeight={700}>ข้อมูลบุคคล (เจ้าของร้าน)</Text>
        </Col>
        <div
          style={{
            marginTop: 16,
          }}
        >
          <Row
            style={{
              marginBottom: 8,
              padding: "8px 0",
            }}
          >
            <Col span={5}>
              <Text color='Text3'>ชื่อเจ้าของร้าน :</Text>
            </Col>
            <Col span={19}>
              <Text>
                {detail?.customer?.title || "-"} {detail?.customer?.ownerFirstname || ""}{" "}
                {detail?.customer?.ownerLastname || ""}
              </Text>
            </Col>
          </Row>
          <Row
            style={{
              marginBottom: 8,
              padding: "8px 0",
            }}
          >
            <Col span={5}>
              <Text color='Text3'>ชื่อเล่น :</Text>
            </Col>
            <Col span={19}>
              <Text>{detail?.customer?.nickname || "-"}</Text>
            </Col>
          </Row>
          <Row
            style={{
              marginBottom: 8,
              padding: "8px 0",
            }}
          >
            <Col span={5}>
              <Text color='Text3'>วันที่เริ่มเป็นสมาชิก :</Text>
            </Col>
            <Col span={19}>
              <Text>
                {dayjs(detail?.createDate || "")
                  .locale("th")
                  .format("D MMM BBBB")}
              </Text>
            </Col>
          </Row>
          <Row
            style={{
              marginBottom: 8,
              padding: "8px 0",
            }}
          >
            <Col span={5}>
              <Text color='Text3'>เบอร์โทรศัพท์ :</Text>
            </Col>
            <Col span={19}>
              <Text>{detail?.customer?.telephone}</Text>
            </Col>
          </Row>
          <Row
            style={{
              marginBottom: 8,
              padding: "8px 0",
            }}
          >
            <Col span={5}>
              <Text color='Text3'>อีเมล์ :</Text>
            </Col>
            <Col span={19}>
              <Text>{detail?.customer?.email || "-"}</Text>
            </Col>
          </Row>
        </div>

        <br />
        <Col>
          <Text fontWeight={700}>ข้อมูลร้านค้า</Text>
        </Col>
        <Row
          style={{
            marginBottom: 8,
            padding: "8px 0",
          }}
        >
          <Col span={5}>
            <Text color='Text3'>ชื่อร้านค้า :</Text>
          </Col>
          <Col span={19}>
            <Text>{detail?.customerName}</Text>
          </Col>
        </Row>
        <Row
          style={{
            marginBottom: 8,
            padding: "8px 0",
          }}
        >
          <Col span={5}>
            <Text color='Text3'>รูปแบบการชำระเงิน :</Text>
          </Col>
          <Col span={19}>
            <Text>
              {detail?.termPayment === "COD"
                ? "เงินสด"
                : `เครดิต (ระยะเวลาชำระ ${detail?.termPayment?.split("N")[1]} วัน)`}
            </Text>
          </Col>
        </Row>
        <Row
          style={{
            marginBottom: 8,
            padding: "8px 0",
          }}
        >
          <Col span={5}>
            <Text color='Text3'>หมายเลขนิติบุคคล :</Text>
          </Col>
          <Col span={19}>
            <Text>{detail?.customer?.taxNo}</Text>
          </Col>
        </Row>
        <Row
          style={{
            marginBottom: 8,
            padding: "8px 0",
          }}
        >
          <Col span={5}>
            <Text color='Text3'>เขต :</Text>
          </Col>
          <Col span={19}>
            <Text>{detail?.zone}</Text>
          </Col>
        </Row>
        <Row
          style={{
            marginBottom: 8,
            padding: "8px 0",
          }}
        >
          <Col span={5}>
            <Text color='Text3'>ที่อยู่ร้านค้า :</Text>
          </Col>
          <Col span={19}>
            <Text>
              {detail?.customer?.address} ตำบล/แขวง {detail?.customer?.subdistrict || "-"} อำเภอ/เขต{" "}
              {detail?.customer?.district || "-"} จังหวัด {detail?.customer?.province || "-"}{" "}
              {detail?.customer?.postcode || ""}
            </Text>
          </Col>
        </Row>
        <Row
          style={{
            marginBottom: 8,
            padding: "8px 0",
          }}
        >
          <Col span={5}>
            <Text color='Text3'>ตำแหน่ง ละติจูด / ลองจิจูด :</Text>
          </Col>
          <Col span={19}>
            <Text>
              {detail?.customer?.lat} / {detail?.customer?.lag}
            </Text>
          </Col>
        </Row>
      </>
    );
  };

  const mockHis = [
    {
      date: "10/09/2021 10:40 น.",
      updateBy: "รชยา ช่างภักดี",
      activity: "สร้างร้านค้า",
      telephone: "0938355808",
    },
  ];

  const columns: any = [
    {
      title: "วันเวลาที่อัปเดท",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "ผู้ใช้งาน",
      dataIndex: "updateBy",
      key: "updateBy",
    },
    {
      title: "กิจกรรม",
      dataIndex: "activity",
      key: "activity",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "telephone",
      key: "telephone",
    },
  ];

  const HistoryTab = () => {
    return (
      <>
        <div style={{ paddingLeft: "12px" }}>
          <Text fontWeight={700}>ประวัติการบันทึกข้อมูล</Text>
        </div>
        <br />
        <TableContainer>
          <Table
            columns={columns}
            dataSource={mockHis || []}
            pagination={false}
            // pagination={{
            //   total: historyData.length,
            //   current: page,
            //   pageSize: 10,
            //   onChange: (page) => {
            //     setPage(page);
            //   },
            //}}
          />
        </TableContainer>
      </>
    );
  };

  const BrandTab = () => {
    return (
      <>
        <div style={{ paddingLeft: "12px" }}>
          <Text fontWeight={700}>แบรนด์สินค้าในร้าน</Text>
        </div>
        <br />
        {detail?.productBrand?.length ? (
          <Row justify={"start"} gutter={16} style={{ padding: "5px" }}>
            {detail?.productBrand?.map((b) => (
              <Col
                span={6}
                key={b?.product_brand_id}
                style={{ height: "100%", paddingBottom: "10px" }}
              >
                <Row
                  style={{
                    borderStyle: "solid",
                    borderRadius: "8px",
                    borderColor: "#EFF2F9",
                    borderWidth: "1px",
                    padding: "5px",
                  }}
                >
                  <Col span={5}>
                    <Avatar src={b?.product_brand_logo} size={50} />
                  </Col>
                  <Col className='pt-3'>{b?.product_brand_name}</Col>
                </Row>
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{ padding: "100px" }}>
            <Row justify={"center"}>
              <Col>
                <img src={image.emptyTableBrand} />
              </Col>
              <br />
            </Row>
            <Row justify={"center"}>
              <Text color='Text3'>ไม่มีรายการแบรนด์สินค้า</Text>
            </Row>
          </div>
        )}
      </>
    );
  };

  const dataTabs: { key: string; label: React.ReactNode; children?: JSX.Element | undefined }[] = [
    {
      key: "detail",
      label: "รายละเอียดร้านค้า",
      children: <DetailTab />,
    },
    {
      key: "brand",
      label: `แบรนด์สินค้าในร้าน (${detail?.productBrand?.length})`,
      children: <BrandTab />,
    },
    // {
    //   key: "history",
    //   label: "ประวัติการบันทึกข้อมูล",
    //   children: <HistoryTab />,
    // },
  ];

  return (
    <CardContainer>
      <PageTitleNested
        title='รายละเอียดร้านค้า'
        cutParams
        onBack={() => {
          navigate("/ShopManagementPage/CorporateShop");
        }}
        description={""}
        extra={
          <Button
            typeButton={"primary"}
            //disabled={isDisabled}
            onClick={() => {
              navigate(`/ShopManagementPage/createCorporateShop/${id}/edit`);
            }}
            icon={
              <FormOutlined
                style={{
                  color: "white",
                  fontSize: 17,
                }}
              />
            }
            title='แก้ไขรายละเอียด'
          />
        }
      />
      <div
        style={{
          marginTop: 24,
        }}
      >
        <AntdTabs data={dataTabs} />
      </div>
    </CardContainer>
  );
}

export default DetailCorporateShop;
