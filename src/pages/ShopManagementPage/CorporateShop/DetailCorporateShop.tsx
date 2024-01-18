import React from "react";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import { FormOutlined } from "@ant-design/icons";
import AntdTabs from "../../../components/AntdTabs/AntdTabs";
import { useNavigate } from "react-router-dom";
import { Col, Row, Table } from "antd";
import styled from "styled-components";
import { color } from "../../../resource";
import TableContainer from "../../../components/Table/TableContainer";

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

  const DetailTab = () => {
    return (
      <>
        <Header>
          <Image src={company?.companyLogo || ""} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <Text level={6} fontWeight={700}>
              {company?.companyNameTh}
            </Text>
            <Row justify={"space-between"} gutter={8}>
              <Col>
                <Text level={6}>ประเภทคู่ค้า : {company?.companyNameTh}</Text>
              </Col>
              <Col>
                <Text level={6}>รหัสร้านค้า : -</Text>
              </Col>
              <Col>
                <Text level={6}>เขต : M01</Text>
              </Col>
            </Row>
            <Row justify={"space-between"} gutter={8}>
              <Col>
                <Text level={6}>Product Brands :</Text>
              </Col>
              <Col>
                <img src='' />
                <Text level={6}>ลัดดา</Text>
              </Col>
              <Col>
                <img src='' />
                <Text level={6}>ตราม้าบิน</Text>
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
              <Text>นาย วรนิษฐ พิศักดิ์ศิริ</Text>
            </Col>
          </Row>
          <Row
            style={{
              marginBottom: 8,
              padding: "8px 0",
            }}
          >
            <Col span={5}>
              <Text color='Text3'>หมายเลขบัตรประชาชน :</Text>
            </Col>
            <Col span={19}>
              <Text>4854701245280</Text>
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
              <Text>1 ก.ย. 2565</Text>
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
              <Text>0897778888</Text>
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
            <Text>วรนิษฐ พิศักดิ์ศิริ</Text>
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
            <Text>1854701245280</Text>
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
            <Text>M1</Text>
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
            <Text>5 หมู่ 2 ตำบล/แขวง บางตะเคียน อำเภอ/เขต สองพี่น้อง จังหวัด สุพรรณบุรี 72110</Text>
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
            <Text>3.7279273 / 100.5219195</Text>
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

  const dataTabs: { key: string; label: React.ReactNode; children?: JSX.Element | undefined }[] = [
    {
      key: "detail",
      label: "รายละเอียดร้านค้า",
      children: <DetailTab />,
    },
    {
      key: "history",
      label: "ประวัติการบันทึกข้อมูล",
      children: <HistoryTab />,
    },
  ];

  return (
    <CardContainer>
      <PageTitleNested
        title='รายละเอียดร้านค้า'
        cutParams
        onBack={() => {
          navigate("/ShopManagementPage/CorporateShop");
        }}
        description={
          <Text
            fontWeight={500}
            level={6}
            style={{
              marginTop: 8,
            }}
          >
            รหัสสมาชิก:
          </Text>
        }
        extra={
          <Button
            typeButton={"primary"}
            //disabled={isDisabled}
            onClick={() => {
              navigate("/ShopManagementPage/createCorporateShop/1");
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
