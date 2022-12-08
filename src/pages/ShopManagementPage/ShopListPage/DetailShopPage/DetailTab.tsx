import { Col, Row } from "antd";
import dayjs from "dayjs";
import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Text from "../../../../components/Text/Text";
import color from "../../../../resource/color";
import { profileAtom } from "../../../../store/ProfileAtom";
import { getCompanyImage, getCompanyName } from "../../../../utility/CompanyName";

const Container = styled.div``;
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
function DetailTab(): JSX.Element {
  const profile = useRecoilValue(profileAtom);

  const listData = {
    shopName: {
      label: "ชื่อร้าน",
      value: "หจก.พืชสิน",
    },
    shopOwner: {
      label: "เจ้าของร้าน",
      value: "นาย พิชญ์ พิชญ์",
    },
    zone: {
      label: "พื้นที่",
      value: "C01",
    },
    addressShop: {
      label: "ที่อยู่ร้านค้า",
      value: "123/456 ถนน สุขุมวิท แขวง บางกอกใหญ่ เขต บางกอกใหญ่ กรุงเทพมหานคร 10700",
    },
    addressLatLong: {
      label: "ตำแหน่ง ละติจูด / ลองจิจูด",
      value: "13.736717 / 100.523186",
    },
    personalShopId: {
      label: "หมายเลขนิติบุคคล",
      value: Math.random().toString(36).substring(7),
    },
    personalId: {
      label: "หมายเลขบัตรประชาชน",
      value: Math.random().toString(36).substring(7),
    },
    dateStartMember: {
      label: "วันที่เริ่มเป็นสมาชิก",
      value: dayjs().format("D/MMM/BBBB"),
    },
    email: {
      label: "อีเมล",
      value: "mockingJ@iconkaset.com",
    },
    telMain: {
      label: "เบอร์โทรศัพท์ (หลัก)",
      value: "0812345678",
    },
    telSub: {
      label: "เบอร์โทรศัพท์ (รอง)",
      value: "0812345679",
    },
  };
  const listDataKey = Object.keys(listData);
  const mockData = [
    {
      company: "ICPL",
      companyType: "Dealer",
      companyCode: "ICPL000002",
      zone: "C01",
    },
    {
      company: "ICPF",
      companyType: "Sub Dealer",
      companyCode: "ICPF000002",
      zone: "C02",
    },
  ];
  return (
    <Container>
      <Header>
        <Image src={getCompanyImage(profile?.company || "")} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Text level={6} fontWeight={700}>
            {getCompanyName(profile?.company || "")}
          </Text>
          <Row gutter={16}>
            <Col>
              <Text level={6} fontFamily='Sarabun'>
                ประเภทคู่ค้า :
                <Text
                  level={6}
                  color='primary'
                  fontFamily='Sarabun'
                  style={{
                    marginLeft: 4,
                  }}
                >
                  Dealer
                </Text>
              </Text>
            </Col>
            <Col>
              <Text level={6} fontFamily='Sarabun'>
                รหัสร้านค้า : ICPL000002
              </Text>
            </Col>
            <Col>
              <Text level={6} fontFamily='Sarabun'>
                เขต : C01
              </Text>
            </Col>
          </Row>
        </div>
      </Header>
      <div
        style={{
          marginTop: 16,
        }}
      >
        {listDataKey.map((el) => {
          return (
            <Row
              key={el}
              style={{
                marginBottom: 8,
              }}
            >
              <Col span={4}>
                <Text color='Text3'>{listData[el as keyof typeof listData].label}</Text>
              </Col>
              <Col span={20}>
                <Text>{listData[el as keyof typeof listData].value}</Text>
              </Col>
            </Row>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 32,
          paddingBottom: 16,
        }}
      >
        <Text fontWeight={700}>คู่ค้าบริษัทในเครือ ICP Group</Text>
        <div
          style={{
            padding: "0 16px",
          }}
        >
          {mockData.map((el, idx) => {
            return (
              <Row
                key={idx}
                gutter={16}
                style={{
                  marginTop: 24,
                }}
              >
                <Col span={2}>
                  <div
                    style={{
                      backgroundColor: color.background2,
                      borderRadius: 8,
                      width: 54,
                      height: 50,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      alt='img_company'
                      src={getCompanyImage(el.company)}
                      style={{
                        maxWidth: 40,
                        maxHeight: 40,
                      }}
                    />
                  </div>
                </Col>
                <Col span={22}>
                  <Text level={6} fontWeight={700}>
                    {getCompanyName(el.company || "")}
                  </Text>
                  <Row gutter={16}>
                    <Col>
                      <Text level={6} fontFamily='Sarabun'>
                        ประเภทคู่ค้า :
                        <Text
                          level={6}
                          color='primary'
                          fontFamily='Sarabun'
                          style={{
                            marginLeft: 4,
                          }}
                        >
                          {el.companyType}
                        </Text>
                      </Text>
                    </Col>
                    <Col>
                      <Text level={6} fontFamily='Sarabun'>
                        รหัสร้านค้า : {el.companyCode}
                      </Text>
                    </Col>
                    <Col>
                      <Text level={6} fontFamily='Sarabun'>
                        เขต : {el.zone}
                      </Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

export default DetailTab;
